# Plataforma "Vida Marina" - Arquitectura Orientada a Objetos (POO)

Este proyecto implementa formalmente los conceptos y patrones de la **Programación Orientada a Objetos (POO)** para modelar la plataforma interactiva y educativa **Vida Marina**.

---

## 🏛️ Los 4 Pilares de la Programación Orientada a Objetos en Vida Marina

### 1. Abstracción (Abstraction)
Modelado de las entidades centrales del mundo real de conservación marina en clases con responsabilidades específicas:
* `User`: Representa a cualquier usuario registrado en la plataforma.
* `Activity`: Modela jornadas de voluntariado, limpiezas de playa, siembra de corales y talleres.
* `Badge`: Modela los reconocimientos oficiales digitales con requisitos y fechas de otorgamiento.
* `ForumPost` y `ForumComment`: Modelan los hilos comunitarios de debate ecológico.

### 2. Encapsulamiento (Encapsulation)
Cada clase protege su estado interno y expone métodos bien definidos para manipular sus datos:
* `User.addXP(points)`: Calcula de forma automática la progresión de nivel (Nivel 1 a 5) según los umbrales matemáticos establecidos.
* `Activity.enrollUser(userId)`: Valida la disponibilidad de cupos antes de agregar al participante.
* `ForumPost.addComment()` y `ForumPost.togglePin()`: Administran la colección de comentarios y el estado de fijación dentro de la propia instancia.

### 3. Herencia (Inheritance)
Especialización de clases mediante la jerarquía de herencia ES6:
```
          ┌─────────────┐
          │    User     │ (Clase Base)
          └──────┬──────┘
                 │
       ┌─────────┴─────────┐
       ▼                   ▼
┌──────────────┐    ┌────────────────────┐
│  Volunteer   │    │  AdminCoordinator  │
└──────────────┘    └────────────────────┘
```
* `Volunteer extends User`: Especialización para miembros comunitarios, incorporando métodos de cálculo de impacto ecológico (`calculateEcologicalImpact`).
* `AdminCoordinator extends User`: Especialización para coordinadores y administradores con capacidades de gestión, moderación y concesión oficial.

### 4. Polimorfismo (Polymorphism)
Sobreescritura de métodos entre clases hijas y la clase base:
* `user.canModerate()`:
  - Retorna `false` en instancias de `Volunteer`.
  - Retorna `true` en instancias de `AdminCoordinator`.
* `user.getRoleBadgeColor()`:
  - Retorna estilo turquesa (`bg-cyan-500/20 text-cyan-300`) para Voluntarios.
  - Retorna estilo dorado (`bg-amber-500/20 text-amber-300`) para Administradores.

---

## 🧩 Patrones de Diseño Implementados

* **Singleton Pattern (`DatabaseService`):** Garantiza un único punto de acceso global para la lectura, escritura y sincronización de datos en `localStorage`, evitando condiciones de carrera y manteniendo coherencia en la memoria.
* **Factory / Hydration Methods:** `DatabaseService.hydrateUser()`, `hydrateActivity()`, etc., reconstruyen instancias de clases vivas con métodos ejecutables a partir de JSON planos.
* **Controller / Service Layer:** `PlatformManager` desacopla la lógica de negocio de la capa de interfaz gráfica (UI).

---

## 📁 Estructura del Código

```
vida-marina/
├── index.html                   # Interfaz gráfica que ejecuta las clases POO
├── README.md                    # Este documento explicativo
├── assets/                      # Logotipo oficial y fotografías submarinas
│   ├── logo_vida_marina.jpg
│   ├── arrecife_coral_1.png
│   ├── peces_arrecife_2.png
│   └── ecosistema_marino_3.png
└── src/
    ├── models/
    │   ├── User.js              # User, Volunteer, AdminCoordinator
    │   ├── Activity.js          # Activity
    │   ├── Badge.js             # Badge
    │   └── ForumPost.js         # ForumPost, ForumComment
    ├── services/
    │   └── DatabaseService.js   # Singleton DatabaseService
    └── app.js                   # PlatformManager
```

---

## 🚀 Cómo Ejecutar el Proyecto
1. Descomprime el archivo `vida_marina_poo.zip`.
2. Haz doble clic en `index.html` para abrirlo en cualquier navegador web.
3. No requiere Node.js, XAMPP ni instalación de servidores externos.
