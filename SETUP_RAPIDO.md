# 🚀 INSTRUCCIONES FINALES - COLGO LISTO PARA USAR

## ⏱️ SOLO 5 PASOS (5 minutos)

### **PASO 1: Abrir MySQL y ejecutar**

Copia y pega en MySQL Workbench o Command Line:

```sql
USE colgo_db;

DELETE FROM usuarios WHERE email = 'mario@colgo.edu';

INSERT INTO usuarios (email, password_hash, rol, activo, cambiar_password) 
VALUES ('mario@colgo.edu', '$2a$10$X/oP7Tsl8X8UF3SHlf9YLeBbVKMAF/hqb5x3pJCv5KhAJ2T1/eqhe', 'admin', 1, 0);

SELECT * FROM usuarios;
```

✅ Deberías ver el usuario MARIO en la lista

---

### **PASO 2: Detener TODO (si estaba corriendo)**

Si backend o frontend estaban corriendo:
- Presiona **Ctrl+C** en ambas terminales
- Espera 3 segundos

---

### **PASO 3: Ejecutar BACKEND (Terminal 1)**

```bash
cd D:\IUE\COLGO\colgo-academi-saas
npm run server
```

✅ Deberías ver:
```
✓ Backend COLGO corriendo en puerto 3001
✓ Entorno: development
✓ BD: colgo_db en localhost
```

---

### **PASO 4: Ejecutar FRONTEND (Terminal 2)**

```bash
cd D:\IUE\COLGO\colgo-academi-saas
npm run dev
```

✅ Deberías ver:
```
Local: http://localhost:5173/
```

---

### **PASO 5: INGRESA AL SISTEMA**

Abre navegador: `http://localhost:5173`

**Credenciales:**
- Usuario: **MARIO** (o mario@colgo.edu)
- Contraseña: **123**

✅ ¡DEBERÍAS VER EL DASHBOARD ADMIN!

---

## 🎯 ¿QUÉ PUEDES HACER AHORA?

Desde el dashboard admin puedes:
- ✅ Ver estudiantes
- ✅ Ver docentes  
- ✅ Ver cursos
- ✅ Ver matrículas
- ✅ Ver pagos
- ✅ Ver sedes

---

## 🆘 SI NO FUNCIONA

### Problema: "No conecta al servidor"
**Solución:**
1. Verifica que `npm run server` está corriendo
2. Verifica que MySQL está corriendo
3. Presiona F5 en el navegador

### Problema: "Error 401"
**Solución:**
1. Limpia cookies: Ctrl+Shift+Del
2. Intenta de nuevo
3. Verifica que ejecutaste el SQL del usuario MARIO

### Problema: "Conexión rechazada"
**Solución:**
1. Reinicia ambos servidores
2. Verifica credenciales en `.env`

---

## 📝 CREDENCIALES GUARDADAS

```
Email: mario@colgo.edu
Usuario: MARIO
Contraseña: 123
Rol: admin
```

---

✅ **¡LISTO! Sistema completamente operativo**

Cualquier problema, avísame 👍
