// const form = document.getElementById("product-form");

// form.addEventListener("submit", async (event) => {
//     event.preventDefault();

//     const formData = new FormData(form);

//     try {
//         const response = await fetch("/api/products", {
//             method: "POST",
//             body: formData,
//             credentials: 'include',
//         });

//         const contentType = response.headers.get('Content-Type');

//         if (contentType && contentType.includes('application/json')) {
//             const data = await response.json();
            
//             if (data.status === "success") {
//                 Swal.fire({
//                     title: "Producto creado",
//                     text: "El producto ha sido creado exitosamente.",
//                     icon: "success",
//                 });
//             }
//         } else if (contentType && contentType.includes('text/plain')) {
//             const text = await response.text();

//             if (text.status === "success") {
//                 Swal.fire({
//                     title: "Producto creado",
//                     text: "El producto ha sido creado exitosamente.",
//                     icon: "success",
//                 });
//             }
//         } else {
//             Swal.fire({
//                 title: "Error",
//                 text: "Hubo un error al crear el producto. Por favor, inténtalo de nuevo.",
//                 icon: "error",
//             });
//         }
//     } catch (error) {
//         // Maneja cualquier error de la solicitud
//         console.error(error);
//     }
// });