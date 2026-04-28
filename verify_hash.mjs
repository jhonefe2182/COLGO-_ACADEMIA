import bcrypt from 'bcryptjs';

const password = '123';
const rounds = 10;

// El hash que tenemos
const existingHash = '$2a$10$X/oP7Tsl8X8UF3SHlf9YLeBbVKMAF/hqb5x3pJCv5KhAJ2T1/eqhe';

// Verificar si el hash actual es válido para "123"
console.log('\n🔍 Verificando hash actual...');
bcrypt.compare(password, existingHash, (err, isValid) => {
  if (err) {
    console.log('❌ Error:', err.message);
    process.exit(1);
  }
  console.log(`✓ Hash válido para "123": ${isValid ? '✅ SÍ' : '❌ NO'}`);
  
  if (!isValid) {
    // Generar un nuevo hash
    console.log('\n🔄 Generando nuevo hash...');
    bcrypt.hash(password, rounds, (err, newHash) => {
      if (err) {
        console.log('❌ Error:', err.message);
        process.exit(1);
      }
      console.log(`✅ Nuevo hash generado:\n${newHash}`);
      console.log('\n📝 Ejecuta este comando en MySQL:');
      console.log(`UPDATE usuarios SET password_hash = '${newHash}' WHERE email = 'mario@colgo.edu';`);
      process.exit(0);
    });
  } else {
    console.log('\n✅ El hash es correcto. No es necesario actualizar.');
    process.exit(0);
  }
});
