require('dotenv').config();
const mongoose = require('mongoose');
const { Usuario, ROLES } = require('./models/Usuario');
const Categoria = require('./models/Categoria');

const ADMIN = {
  nombre: 'Admin',
  apellido: 'SistemNetwork',
  email: 'admin@sistemnetwork.edu.co',
  password: 'Admin1234!',
  rol: ROLES.ADMINISTRADOR,
};

const CATEGORIAS_BASE = [
  {
    nombre: 'Información Académica',
    descripcion: 'Noticias, avisos y comunicados relacionados con el ámbito académico universitario.',
    color: '#6B21A8',
  },
  {
    nombre: 'Eventos',
    descripcion: 'Eventos, actividades y convocatorias organizadas dentro de la comunidad universitaria.',
    color: '#0E7490',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' Conectado a MongoDB Atlas\n');

   
    const existeAdmin = await Usuario.findOne({ email: ADMIN.email });
    if (existeAdmin) {
      console.log(`  El admin ya existe: ${ADMIN.email}`);
      
      if (existeAdmin.rol !== ROLES.ADMINISTRADOR) {
        existeAdmin.rol = ROLES.ADMINISTRADOR;
        await existeAdmin.save({ validateBeforeSave: false });
        console.log(' Rol corregido a administrador.');
      }
    } else {
      
      await Usuario.create({ ...ADMIN });
      console.log(' Administrador creado:');
      console.log(`   Email    : ${ADMIN.email}`);
      console.log(`   Contraseña: ${ADMIN.password}`);
    }

    
    const adminUser = await Usuario.findOne({ email: ADMIN.email });

    for (const cat of CATEGORIAS_BASE) {
      const existe = await Categoria.findOne({ nombre: cat.nombre });
      if (existe) {
        console.log(`  Categoría ya existe: "${cat.nombre}"`);
      } else {
        await Categoria.create({ ...cat, creadoPor: adminUser._id });
        console.log(`  Categoría creada: "${cat.nombre}"`);
      }
    }

    console.log('\n Seed completado.');
    console.log('──────────────────────────────────────────');
    console.log('  Credenciales del administrador:');
    console.log(`   Email      : ${ADMIN.email}`);
    console.log(`   Contraseña : ${ADMIN.password}`);
    console.log('──────────────────────────────────────────\n');
  } catch (err) {
    console.error(' Error en seed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}
seed();