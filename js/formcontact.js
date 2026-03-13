const SERVICE_ID  = "service_jb1cisc";
  const TEMPLATE_ID = "template_xr8rk4b";

  // ── Botón de email simple (como antes) ──────────────────────────
  function enviarConsulta() {
    abrirModal("devcore.studio.mx@gmail.com", null);
  }

  // ── Botón del formulario ────────────────────────────────────────
  function handleSubmit(e) {
  e.preventDefault();

  const name    = document.getElementById("form-name").value.trim();
  const email   = document.getElementById("form-email").value.trim();
  const service = document.getElementById("form-service").value;
  const message = document.getElementById("form-message").value.trim();

  if (!name || !email || !service || !message) {
    alert("Por favor completa todos los campos.");
    return;
  }

  // Muestra el correo del CLIENTE en el modal
  abrirModal(email, { name, email, service, message });
}

  // ── Modal ───────────────────────────────────────────────────────
  let _pendingParams = null;

  function abrirModal(emailDestino, params) {
    _pendingParams = params; // null = consulta simple, objeto = form

    document.getElementById("modalEmail").textContent = emailDestino;
    document.getElementById("emailModal").style.display = "flex";
    document.getElementById("modalConfirm").style.display = "block";
    document.getElementById("modalSuccess").style.display  = "none";
    document.getElementById("modalError").style.display    = "none";
  }

  function confirmarEnvio() {
    let templateParams;

    if (_pendingParams) {
      // Viene del formulario — usa datos reales del cliente
      templateParams = {
        name:    _pendingParams.name,
        email:   _pendingParams.email,
        time:    new Date().toLocaleString("es-MX"),
        message: `Servicio: ${_pendingParams.service}\n\n${_pendingParams.message}`
      };
    } else {
      // Viene del botón simple
      templateParams = {
        name:    "Visitante Web",
        email:   "devcore.studio.mx@gmail.com",
        time:    new Date().toLocaleString("es-MX"),
        message: "Hola, me interesa información sobre sus servicios. ¿Podrían decirme más sobre lo que ofrecen?"
      };
    }

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
      .then(() => {
        document.getElementById("modalConfirm").style.display = "none";
        document.getElementById("modalSuccess").style.display  = "block";

        // Limpiar form si aplica
        if (_pendingParams) limpiarForm();
      })
      .catch((error) => {
        console.error("Error EmailJS:", error);
        document.getElementById("modalConfirm").style.display = "none";
        document.getElementById("modalError").style.display    = "block";
      });
  }

  function limpiarForm() {
    document.getElementById("form-name").value    = "";
    document.getElementById("form-email").value   = "";
    document.getElementById("form-service").value = "";
    document.getElementById("form-message").value = "";
  }

  function cerrarModal() {
    document.getElementById("emailModal").style.display = "none";
    _pendingParams = null;
  }

  document.getElementById("emailModal").addEventListener("click", function(e) {
    if (e.target === this) cerrarModal();
  });
