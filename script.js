// Dirección del contrato y ABI del contrato proporcionado
const contratoAddress = '0xe29e714411B4a43111b212343E35a919fcAE6Be9';
const contratoABI = [
  {
    "inputs": [{ "internalType": "string", "name": "nuevoSaludo", "type": "string" }],
    "name": "cambiarSaludo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Inicializa WalletConnectProvider
const provider = new WalletConnectProvider.default({
  rpc: {
    1: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID", // Cambiar por tu propio Infura ID
  },
});

let web3;
let cuenta;

// Conecta la wallet usando WalletConnect
async function conectarWallet() {
  try {
    await provider.enable(); // Habilitar el proveedor
    web3 = new Web3(provider);

    const cuentas = await web3.eth.getAccounts();
    cuenta = cuentas[0];

    console.log(`Wallet conectada: ${cuenta}`);

    provider.on('disconnect', (code, reason) => {
      console.log(`Desconectado: ${code}, Razón: ${reason}`);
    });
  } catch (error) {
    console.error('Error al conectar wallet:', error);
  }
}

// Envía la transacción al contrato
async function registrar() {
  try {
    const contrato = new web3.eth.Contract(contratoABI, contratoAddress);
    const saludo = prompt("Escribe un saludo:");

    if (!saludo) {
      alert("Por favor, escribe un saludo válido.");
      return;
    }

    const tx = await contrato.methods.cambiarSaludo(saludo).send({
      from: cuenta,
      gas: 300000,
    });

    console.log('Transacción exitosa:', tx);
    alert('¡Saludo registrado con éxito!');
  } catch (error) {
    console.error('Error en la transacción:', error);
    alert('Error en la transacción. Revisa la consola para más detalles.');
  }
}

// Añade eventos al botón de registro
document.getElementById('registrarse').addEventListener('click', async () => {
  if (!cuenta) {
    await conectarWallet();
  }
  registrar();
});