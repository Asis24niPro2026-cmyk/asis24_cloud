# Cambiar Credenciales de Administrador - ASIS24

## 📋 Descripción

Este documento explica cómo cambiar las credenciales de acceso al panel de administración de ASIS24.

## 🔐 Seguridad

Las contraseñas se almacenan de forma segura usando **bcryptjs** (hash de 10 rondas). Nunca se almacenan en texto plano.

## ⚙️ Cambiar Credenciales Localmente (Desarrollo)

Si estás desarrollando localmente, puedes cambiar las credenciales ejecutando:

```bash
node scripts/set-admin-credentials.mjs <usuario> <contraseña>
```

**Ejemplo:**
```bash
node scripts/set-admin-credentials.mjs admin micontraseña123
```

### Requisitos:
- La contraseña debe tener al menos 6 caracteres
- El usuario debe ser único (si ya existe, se actualiza)

## 🚀 Cambiar Credenciales en Producción (Manus)

Una vez que tu aplicación esté publicada en Manus, tienes dos opciones:

### Opción 1: Usar la Base de Datos (Recomendado)

1. **Accede a la base de datos** desde el panel de Manus:
   - Ve a "Database" en el panel de gestión
   - Conéctate a la base de datos MySQL

2. **Ejecuta una consulta SQL** para actualizar las credenciales:

```sql
-- Primero, genera el hash de la contraseña usando bcryptjs
-- Puedes hacerlo en Node.js:
-- const bcryptjs = require('bcryptjs');
-- const hash = await bcryptjs.hash('tucontraseña', 10);
-- Luego reemplaza 'HASH_AQUI' con el resultado

UPDATE admin_users 
SET passwordHash = '$2a$10$...' 
WHERE username = 'admin';

-- Si el usuario no existe, insértalo:
INSERT INTO admin_users (username, passwordHash, role) 
VALUES ('admin', '$2a$10$...', 'admin');
```

### Opción 2: Usar la API de Manus

Puedes crear un endpoint personalizado en tu aplicación para cambiar credenciales:

```typescript
// En server/routers.ts
admin: router({
  changePassword: publicProcedure
    .input(z.object({ 
      oldPassword: z.string(),
      newPassword: z.string(),
      username: z.string()
    }))
    .mutation(async ({ input }) => {
      // Validar contraseña antigua
      const isValid = await authenticateAdmin(input.username, input.oldPassword);
      if (!isValid) throw new Error("Contraseña actual incorrecta");
      
      // Establecer nueva contraseña
      await setAdminCredentials(input.username, input.newPassword);
      return { success: true };
    }),
})
```

## 📝 Primeros Pasos Después de Publicar

1. **Accede al panel de admin:**
   ```
   https://tudominio.manus.space/admin
   ```

2. **Inicia sesión con credenciales temporales:**
   - Usuario: `admin`
   - Contraseña: `admin123`

3. **Cambia las credenciales** usando una de las opciones anteriores

4. **Verifica que funciona** iniciando sesión nuevamente con las nuevas credenciales

## 🔒 Mejores Prácticas

✅ **Haz:**
- Usar contraseñas fuertes (mínimo 12 caracteres, con mayúsculas, minúsculas, números y símbolos)
- Cambiar las credenciales inmediatamente después de publicar
- Guardar las credenciales en un lugar seguro (gestor de contraseñas)
- Cambiar la contraseña periódicamente

❌ **No hagas:**
- Usar contraseñas débiles o predecibles
- Compartir las credenciales por email o mensajes de texto
- Guardar las credenciales en archivos de código o repositorios públicos
- Usar la misma contraseña para múltiples servicios

## 🆘 Ayuda

Si olvidaste la contraseña:

1. Accede a la base de datos directamente desde Manus
2. Ejecuta una consulta para establecer una nueva contraseña temporal
3. Inicia sesión con la contraseña temporal
4. Cambia a una contraseña permanente

## 📞 Soporte

Para más información, consulta la documentación de ASIS24 o contacta al equipo de desarrollo.
