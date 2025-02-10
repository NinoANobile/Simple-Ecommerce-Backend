# Simple Ecommerce Backend

Este es el backend de un ecommerce muy simple.

## 🚀 Despliegue

Para deployarlo, podemos usar el servicio de túnel de Cloudflare ejecutando el siguiente comando:

```sh
./cloudflared.exe tunnel --url http://localhost:3000
```

Luego, es necesario editar las variables de entorno en el despliegue del frontend, que está en Vercel.

### 🌍 Acceso al frontend
El dominio para acceder al frontend es:

🔗 [Simple Ecommerce Frontend](https://simple-ecommerce-frontend-red.vercel.app/)

---

## 📦 Funcionalidades

Este ecommerce cuenta con:

✅ Registro, autenticación y autorización con control de roles.
✅ Carga y edición de productos.
✅ Carrito de compras.
✅ Filtros de productos avanzados.
✅ Modo oscuro.

---

## 👤 Cuentas de prueba

### **Vendedores**
- **Email:** `john.doe@example.com`  
  **Password:** `password123`
- **Email:** `jane.doe@example.com`  
  **Password:** `password123`

### **Clientes**
- **Email:** `alice.smith@example.com`  
  **Password:** `password123`
- **Email:** `bob.johnson@example.com`  
  **Password:** `password123`

---

## 📌 Rutas de carga de datos

Este backend permite cargar usuarios, productos y órdenes mediante las siguientes rutas:

- Cargar productos:  
  [`http://localhost:3000/products/seed-products`](http://localhost:3000/products/seed-products)
- Cargar usuarios:  
  [`http://localhost:3000/users/seed-users`](http://localhost:3000/users/seed-users)
- Cargar órdenes:  
  [`http://localhost:3000/orders/seed-orders`](http://localhost:3000/orders/seed-orders)

---

📌 **Recuerda:** Asegúrate de configurar correctamente las variables de entorno antes de ejecutar el backend.

