/**
 * ============================================
 *  RESET-ADMIN - Sistem Network / CKN
 *  Restablece la contraseña del administrador.
 *  Úsalo si el admin no puede iniciar sesión
 *  (por ejemplo, por doble hash de contraseña).
 *
 *  Uso:
 *    cd backend
 *    node reset-admin.js
 * ============================================
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Usuario, ROLES } = require('./models/Usuario');

const ADMIN_EMAIL = 'admin@sistemnetwork.edu.co';
const NUEVA_PASSWORD = 'Admin1234!';

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB Atlas\n');

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(NUEVA_PASSWORD, salt);

    const admin = await Usuario.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      {
        password: hash,
        rol: ROLES.ADMINISTRADOR,
        activo: true,
      },
      { new: true }
    );

    if (!admin) {
      // Si no existe, crearlo directamente con hash ya calculado
      await Usuario.create({
        nombre: 'Admin',
        apellido: 'SistemNetwork',
        email: ADMIN_EMAIL,
        password: hash,
        rol: ROLES.ADMINISTRADOR,
      });
      // Evitar doble hash: usamos updateOne para poner el hash directamente
      await Usuario.updateOne({ email: ADMIN_EMAIL }, { password: hash });
      console.log('👤 Administrador creado desde cero.');
    } else {
      console.log('🔧 Contraseña del administrador restablecida.');
    }

    console.log('\n──────────────────────────────────────────');
    console.log('  Credenciales del administrador:');
    console.log(`  📧 Email      : ${ADMIN_EMAIL}`);
    console.log(`  🔑 Contraseña : ${NUEVA_PASSWORD}`);
    console.log('──────────────────────────────────────────\n');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

resetAdmin();
