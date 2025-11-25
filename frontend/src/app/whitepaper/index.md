# 4. Tokenomics Avanzado

## 4.1 Supply Inicial y Distribución

XCoin se emite con un supply inicial fijo y no inflacionario:

- **Supply inicial (S₀):** 1,000,000 XCOIN  
- **Distribución génesis:**  
  - **80% (800,000 XCOIN)** → Vault de Usuarios (bloqueado por vesting)  
  - **20% (200,000 XCOIN)** → Tesorería del protocolo  

Esta distribución es **irreversible y on-chain**, con transferencia ejecutada en el constructor del contrato `XCoinToken.sol`.

---

## 4.2 Principios Económicos

XCoin incorpora un modelo de vesting único cuyo ritmo depende exclusivamente de la salud económica del proyecto.

Los principios son:

1. **No existe vesting por tiempo.**  
   El desbloqueo se activa solo cuando el MarketCap supera ciertos umbrales.

2. **Vesting alineado al crecimiento real.**  
   El avance depende del valor de XCoin en el mercado, no del paso del tiempo.

3. **Tesorería como estabilizadora estructural.**  
   El 20% inicial otorga respaldo financiero y capacidad operativa.

4. **Fases institucionales fijas, transparentes y auditable on-chain.**

---

## 4.3 Vesting Basado en MarketCap

Cada usuario recibe un **grant g** de XCOIN asignado mediante `allocate(address, amount)`.

El porcentaje desbloqueado depende del MarketCap reportado por el oráculo:

\[
R(MC) = g \cdot \frac{\text{bps}(MC)}{10^{4}} - r
\]

donde:

- \( R(MC) \) = tokens reclamables  
- \( g \) = grant total  
- \( r \) = tokens ya reclamados  
- \( \text{bps}(MC) \) = basis points desbloqueados  

Si \( R(MC) \le 0 \), entonces no hay nada para reclamar.

---

## 4.4 Fases Institucionales del Vesting

El vesting de XCoin se estructura en 6 fases crecientes según MarketCap:

| Fase | MarketCap mínimo | Desbloqueo | bps |
|------|------------------|------------|-----|
| 0 | 1M USD | 10% | 1,000 |
| 1 | 2M USD | 20% | 2,000 |
| 2 | 4M USD | 35% | 3,500 |
| 3 | 6M USD | 50% | 5,000 |
| 4 | 10M USD | 75% | 7,500 |
| 5 | 20M USD | 100% | 10,000 |

El contrato garantiza:

- Crecimiento **monótono** (nunca decrece).  
- No se permite volver atrás una fase.  
- Todas las transiciones son públicas vía eventos.

Formalmente:

\[
\text{bps}(MC)=
\begin{cases}
0 & MC < 1\,000\,000 \\
1000 & 1\,000\,000 \le MC < 2\,000\,000 \\
2000 & 2\,000\,000 \le MC < 4\,000\,000 \\
3500 & 4\,000\,000 \le MC < 6\,000\,000 \\
5000 & 6\,000\,000 \le MC < 10\,000\,000 \\
7500 & 10\,000\,000 \le MC < 20\,000\,000 \\
10000 & MC \ge 20\,000\,000 \\
\end{cases}
\]

---

## 4.5 Ejemplo Numérico

Sea un grant:

\[
g = 1\,000\ \text{XCOIN}
\]

Evolución del desbloqueo:

| MarketCap | % Desbloqueo | Tokens acumulados | Tokens nuevos |
|-----------|--------------|--------------------|----------------|
| 1M | 10% | 100 | 100 |
| 3M | 20% | 200 | 100 |
| 6M | 50% | 500 | 300 |
| 20M | 100% | 1000 | 500 |

El usuario nunca recibe más de lo que corresponde a la fase actual.  
Cada claim es incremental.

---

## 4.6 Dinámica del Oráculo

El MarketCap utilizado por el protocolo se define como:

\[
MC = P \cdot CS
\]

donde:

- \( P \) = precio reportado por oráculo externo  
- \( CS \) = circulating supply  

El oráculo on-chain actualiza:


Todo el proceso es auditable.

---

## 4.7 Modelo Anti-Manipulación (Diseño FASE 6)

Para mitigar ataques de manipulación de precio o MarketCap:

1. **Median filtering (ventanas móviles):**

\[
MC_{filtered} = \text{median}(MC_{n-k} … MC_{n})
\]

2. **Límites por salto de fase:**

\[
\Delta \text{bps}_{max} = 500
\]

3. **Requerimiento de múltiples oráculos.**

4. **Cooldown económico** entre actualizaciones de fase.

5. **Detección de outliers** en oráculo independiente.

Este módulo garantizará que no existan “saltos artificiales” de desbloqueo.

---

## 4.8 Racional Económico del Diseño

- **El proyecto no premia la espera, premia el crecimiento.**  
- **Los usuarios están alineados con el valor fundamental.**  
- **La tesorería del 20% permite sostener operaciones, liquidez y estabilidad.**  
- **El vesting depende de hitos reales del mercado, verificados on-chain.**

Esta arquitectura convierte a XCoin en una **contracara disciplinada de Bitcoin**, donde el crecimiento del valor activa la liberación responsable del supply.

---

## 4.9 Beneficios para Inversores

- Vesting transparente, matemático y auditable.  
- Política monetaria fija, sin inflación.  
- Suministro limitado desde el génesis.  
- Descentralización progresiva del 80% del supply según la tracción del mercado.  
- Prevención de liberaciones anticipadas y venta masiva injustificada.

El mecanismo completo está implementado en `XCoinVault.sol`, totalmente verificado con tests unitarios.

