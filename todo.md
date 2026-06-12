# ASIS24 - Gestión de Pedidos en Nube - TODO

## Funcionalidades Principales

### Base de Datos
- [x] Crear tabla `orders` con campos: id, clientName, phone, business, details, address, status, createdAt, updatedAt
- [x] Crear tabla `admin_users` para autenticación de administrador (username, password_hash, role)

### Formulario Público
- [x] Implementar formulario de registro de pedidos (nombre, teléfono, negocio, descripción, dirección)
- [x] Validar campos obligatorios
- [x] Asignar automáticamente estado "Pendiente" al crear pedido
- [x] Mostrar mensaje de confirmación exitosa
- [x] Agregar botón opcional "Enviar por WhatsApp" (wa.me/50583629444)
- [x] Integrar con tRPC para guardar en base de datos

### Panel de Administración
- [x] Crear página de login para administrador
- [x] Proteger rutas del panel con autenticación
- [x] Implementar vista de lista de pedidos en tiempo real
- [x] Agregar filtros por negocio (Comidería, Papelería, Otros)
- [x] Agregar filtros por estado (Pendiente, Enviado al negocio, Entregado)
- [x] Implementar botón para eliminar pedidos
- [x] Implementar botón para cambiar estado de pedidos

### Notificaciones
- [x] Configurar notificación al administrador cuando llega un nuevo pedido
- [x] Usar sistema de notificaciones de Manus

### Diseño Cinematográfico
- [x] Aplicar gradiente teal profundo + naranja quemado al fondo
- [x] Tipografía sans-serif, blanca, bold, centrada
- [x] Acentos geométricos en cian y naranja
- [x] Efecto de profundidad con sombras y luces
- [x] Responsive optimizado para móvil

### Testing
- [x] Escribir tests para procedimientos tRPC
- [x] Validar flujo de creación de pedidos
- [x] Tests pasando exitosamente (12/12)

### Autenticación de Administrador
- [x] Implementar hash de contraseñas con bcryptjs
- [x] Crear procedimiento tRPC para login seguro
- [x] Crear procedimiento tRPC para logout
- [x] Actualizar panel de admin con autenticación real
- [x] Crear script para establecer credenciales
- [x] Documentar cómo cambiar credenciales

## Completado
- [x] Inicializar proyecto web-db-user
- [x] Crear esquema de base de datos
- [x] Implementar procedimientos tRPC
- [x] Desarrollar formulario público con diseño cinematográfico
- [x] Implementar panel de administración
- [x] Configurar notificaciones
- [x] Escribir y ejecutar tests
- [x] Implementar autenticación segura de administrador
- [x] Crear documentación de cambio de credenciales
