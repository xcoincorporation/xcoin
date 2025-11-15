# XCoin — El otro lado del bloque

XCoin es un experimento de acumulación disciplinada basado en un token ERC-20 y un modelo de liberación por fases condicionado por hitos de Market Cap.  
El foco principal es estudiar mecanismos de acumulación colectiva, estabilidad, transparencia on-chain y liberación controlada de liquidez.

---

## 🌕 Visión general del proyecto

El objetivo de XCoin es demostrar un modelo simple pero auditable de:

- Acumulación transparente  
- Tesorería estable  
- Fases de desbloqueo condicionado  
- Gobernanza mínima  
- Métricas públicas on-chain  
- Costo de entrada accesible (precio de referencia por token)  
- Simetría entre participantes (sin pre-minado)

> “Acumular hoy. Liberar mañana. Decidir entre todos.”

---

## 🔥 Funcionalidades actuales (Frontend)

### ✔️ **Landing principal**
- Presentación de XCoin  
- Tokenomics 80/20  
- Botones rápidos (Whitepaper, Tokenomics, Dashboard técnico)  
- Branding y posicionamiento del proyecto  

### ✔️ **Supply Badge (UI + on-chain)**
- Lee `symbol`, `totalSupply`, `decimals` directamente de la blockchain  
- Panel flotante con:
  - Dirección del contrato
  - Dirección de la Tesorería
  - Botón copiar
  - Exploradores  
  - Refresh on-chain

### ✔️ **Dashboard Técnico /dashboard**
- Lectura de wallet conectada (MetaMask)
- Balance de XCOIN
- Porcentaje del supply total representado
- Botones:
  - Conectar
  - Cambiar wallet
  - Refrescar
  - Desconectar

### ✔️ **Oráculo Mock /oraculo**
- Precio de referencia (mock)
- Market Cap estimado
- Meta de desbloqueo fase 1
- Barra de progreso visual
- Timestamp de lectura
- Estado on-chain (OK o Degradado)
- Botón refrescar
- API dedicada: `/api/oracle`

### 🔍 Oráculo & control anti pump-dump

- El precio de referencia de XCoin se define inicialmente en el backend como un valor de laboratorio, no como un precio de mercado.
- El oráculo lee el supply real desde el contrato y calcula el Market Cap estimado a partir de ese precio de referencia.
- Antes de cualquier listado en exchanges, se fijan las reglas de desbloqueo por fases (80/20) para evitar ciclos de pump & dump descontrolados.
- El 20% asignado a Tesorería está pensado como colchón de liquidez y estabilidad, no como “bolsa de venta” masiva.
- El diseño del oráculo permite reemplazar el precio manual por un feed real (DEX, Chainlink, etc.) sin reescribir la UI ni el dashboard.


## 🧱 Arquitectura del repositorio

📦 xcoin
┣ 📁 frontend → App pública (Next.js 14)
│ ┣ 📁 src/app → Rutas / páginas / API
│ ┣ 📁 components → UI y módulos reutilizables
│ ┣ 📁 hooks → Hooks globales (useToast)
│ ┗ 📁 lib → Lecturas on-chain, helpers
┣ 📁 protocol → Hardhat, contratos, scripts
┣ 📄 README.md → Documento principal
┗ 📄 CHANGELOG.md → Registro de cambios


---

## ⚙️ Instalación & Ejecución

1. Clonar
```bash
git clone https://github.com/xcoincorporation/xcoin.git
cd xcoin/frontend


2. Variables de entorno
Crear archivo .env.local:
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
NEXT_PUBLIC_XCOIN_ADDRESS=0x...
NEXT_PUBLIC_TREASURY_ADDRESS=0x...

3. Instalar dependencias
npm install

4. Ejecutar modo desarrollo
npm run dev

5. Producción
npm run build
npm start

🧪 Estado actual del experimento
Módulo	Estado
Supply Badge on-chain	✅ Completo
Dashboard técnico	✅ Completo
Oráculo / Mock	✅ Completo
Lectura real Chainlink	🔄 Fase 5
Desbloqueo por fases (80/20)	🔄 Fase 6
Auditoría	⏳ En planificación
Versión pública final	⏳ Próxima

🗺️ Roadmap (técnico y funcional)
Fase 1 – Setup inicial ✔️
Fase 2 – Token + ABI + lectura ✔️
Fase 3 – Dashboard técnico ✔️
Fase 4 – Oráculo + Mock ✔️
Fase 5 – Oracle real (Chainlink u opción propia) ⚙️
Fase 6 – Sistema de desbloqueo 80/20 ⚙️
Fase 7 – Auditoría externa ⚙️
Fase 8 – Lanzamiento público ⚙️
⚠️ Disclaimer

Este proyecto es experimental y educativo.
No constituye asesoramiento financiero, ni oferta pública de activos digitales.