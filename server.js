const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

const PORT = process.env.PORT || 3000;

const JWT_SECRET =
  process.env.JWT_SECRET || 'dev-secret-change-this';

app.use(express.json());

// ============================================================
// DATABASE
// ============================================================

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'inventorydb',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

// ============================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required'
    });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid authorization format'
    });
  }

  const token = parts[1];

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
    }

    req.user = user;
    next();
  });
}

// ============================================================
// ROOT
// ============================================================

app.get('/', (req, res) => {
  res.redirect('/login');
});

// ============================================================
// LOGIN PAGE
// ============================================================

app.get('/login', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Inventory Management - Login</title>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: Arial, sans-serif;
      min-height: 100vh;

      display: flex;
      justify-content: center;
      align-items: center;

      background:
        linear-gradient(
          135deg,
          #1a365d,
          #3182ce
        );
    }

    .login-card {
      width: 400px;
      max-width: 90%;

      background: white;

      padding: 40px;

      border-radius: 16px;

      box-shadow:
        0 15px 40px
        rgba(0, 0, 0, 0.25);
    }

    .logo {
      text-align: center;
      font-size: 42px;
      margin-bottom: 10px;
    }

    h1 {
      text-align: center;
      color: #1a202c;
      margin-bottom: 8px;
    }

    .subtitle {
      text-align: center;
      color: #718096;
      margin-bottom: 30px;
    }

    label {
      display: block;
      margin-bottom: 7px;

      font-weight: bold;

      color: #2d3748;
    }

    input {
      width: 100%;

      padding: 13px;

      margin-bottom: 18px;

      border: 1px solid #cbd5e0;

      border-radius: 8px;

      font-size: 15px;
    }

    input:focus {
      outline: none;

      border-color: #3182ce;

      box-shadow:
        0 0 0 3px
        rgba(49, 130, 206, 0.15);
    }

    button {
      width: 100%;

      padding: 14px;

      border: none;

      border-radius: 8px;

      background: #3182ce;

      color: white;

      font-size: 16px;

      font-weight: bold;

      cursor: pointer;
    }

    button:hover {
      background: #2b6cb0;
    }

    button:disabled {
      background: #a0aec0;
      cursor: not-allowed;
    }

    #message {
      margin-top: 18px;

      padding: 12px;

      border-radius: 8px;

      display: none;

      text-align: center;

      font-size: 14px;
    }

    .error {
      display: block !important;

      background: #fed7d7;

      color: #9b2c2c;
    }

    .success {
      display: block !important;

      background: #c6f6d5;

      color: #22543d;
    }

    .footer {
      text-align: center;

      margin-top: 25px;

      color: #a0aec0;

      font-size: 12px;
    }
  </style>
</head>

<body>

  <div class="login-card">

    <div class="logo">📦</div>

    <h1>Inventory Management</h1>

    <p class="subtitle">
      Secure administrator login
    </p>

    <form id="loginForm">

      <label for="username">
        Username
      </label>

      <input
        type="text"
        id="username"
        placeholder="Enter username"
        required
        autocomplete="username"
      >

      <label for="password">
        Password
      </label>

      <input
        type="password"
        id="password"
        placeholder="Enter password"
        required
        autocomplete="current-password"
      >

      <button
        type="submit"
        id="loginButton"
      >
        Sign In
      </button>

    </form>

    <div id="message"></div>

    <div class="footer">
      DevOps Inventory Platform
    </div>

  </div>

  <script>
    const form =
      document.getElementById('loginForm');

    const button =
      document.getElementById('loginButton');

    const message =
      document.getElementById('message');

    form.addEventListener(
      'submit',
      async (event) => {

        event.preventDefault();

        const username =
          document
            .getElementById('username')
            .value
            .trim();

        const password =
          document
            .getElementById('password')
            .value;

        message.className = '';
        message.style.display = 'none';

        button.disabled = true;
        button.textContent = 'Signing in...';

        try {

          const response =
            await fetch(
              '/api/auth/login',
              {
                method: 'POST',

                headers: {
                  'Content-Type':
                    'application/json'
                },

                body:
                  JSON.stringify({
                    username,
                    password
                  })
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
              'Login failed'
            );
          }

          localStorage.setItem(
            'inventory_token',
            data.token
          );

          localStorage.setItem(
            'inventory_user',
            JSON.stringify(data.user)
          );

          message.textContent =
            'Login successful. Opening dashboard...';

          message.className = 'success';

          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 500);

        } catch (error) {

          message.textContent =
            error.message;

          message.className = 'error';

          button.disabled = false;
          button.textContent = 'Sign In';
        }
      }
    );
  </script>

</body>
</html>
  `);
});

// ============================================================
// LOGIN API
// ============================================================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Username and password are required'
      });
    }

    const result = await pool.query(
      'SELECT id, username, password_hash FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid username or password'
      });
    }

    const user = result.rows[0];

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password_hash
      );

    if (!passwordMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid username or password'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username
      },
      JWT_SECRET,
      {
        expiresIn: '8h'
      }
    );

    return res.json({
      status: 'success',
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {

    console.error(
      'Login error:',
      error
    );

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// ============================================================
// HEALTH CHECK
// ============================================================

app.get('/health', async (req, res) => {
  try {

    await pool.query('SELECT 1');

    return res.json({
      status: 'UP',
      database_connected: true,
      uptime_seconds: process.uptime()
    });

  } catch (error) {

    console.error(
      'Health check error:',
      error
    );

    return res.status(503).json({
      status: 'DOWN',
      database_connected: false,
      uptime_seconds: process.uptime()
    });
  }
});

// ============================================================
// GET INVENTORY
// ============================================================

app.get(
  '/api/v1/inventory',
  authenticateToken,
  async (req, res) => {

    try {

      const result =
        await pool.query(
          'SELECT * FROM inventory ORDER BY id'
        );

      return res.json({
        status: 'success',
        timestamp: new Date().toISOString(),
        data: result.rows
      });

    } catch (error) {

      console.error(
        'Get inventory error:',
        error
      );

      return res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve inventory'
      });
    }
  }
);

// ============================================================
// GET INVENTORY - PUBLIC HEALTH/TEST VERSION
// ============================================================

app.get(
  '/api/v1/inventory/public',
  async (req, res) => {

    try {

      const result =
        await pool.query(
          'SELECT * FROM inventory ORDER BY id'
        );

      return res.json({
        status: 'success',
        timestamp: new Date().toISOString(),
        data: result.rows
      });

    } catch (error) {

      console.error(
        'Public inventory error:',
        error
      );

      return res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve inventory'
      });
    }
  }
);

// ============================================================
// ADD INVENTORY
// ============================================================

app.post(
  '/api/v1/inventory',
  authenticateToken,
  async (req, res) => {

    try {

      const {
        id,
        name,
        stock,
        price
      } = req.body;

      if (
        !id ||
        !name ||
        stock === undefined ||
        stock === null ||
        !price
      ) {
        return res.status(400).json({
          status: 'error',
          message:
            'id, name, stock and price are required'
        });
      }

      const numericStock =
        Number(stock);

      if (
        !Number.isInteger(numericStock) ||
        numericStock < 0
      ) {
        return res.status(400).json({
          status: 'error',
          message:
            'Stock must be a non-negative integer'
        });
      }

      const existing =
        await pool.query(
          'SELECT id FROM inventory WHERE id = $1',
          [id]
        );

      if (existing.rows.length > 0) {
        return res.status(409).json({
          status: 'error',
          message:
            'Inventory item with this ID already exists'
        });
      }

      const result =
        await pool.query(
          `
          INSERT INTO inventory
            (id, name, stock, price)
          VALUES
            ($1, $2, $3, $4)
          RETURNING *
          `,
          [
            id,
            name,
            numericStock,
            price
          ]
        );

      return res.status(201).json({
        status: 'success',
        message:
          'Inventory item added successfully',
        data: result.rows[0]
      });

    } catch (error) {

      console.error(
        'Add inventory error:',
        error
      );

      return res.status(500).json({
        status: 'error',
        message:
          'Failed to add inventory item'
      });
    }
  }
);

// ============================================================
// DELETE INVENTORY
// ============================================================

app.delete(
  '/api/v1/inventory/:id',
  authenticateToken,
  async (req, res) => {

    try {

      const { id } = req.params;

      const result =
        await pool.query(
          `
          DELETE FROM inventory
          WHERE id = $1
          RETURNING *
          `,
          [id]
        );

      if (result.rows.length === 0) {
        return res.status(404).json({
          status: 'error',
          message:
            'Inventory item not found'
        });
      }

      return res.json({
        status: 'success',
        message:
          'Inventory item deleted successfully',
        data: result.rows[0]
      });

    } catch (error) {

      console.error(
        'Delete inventory error:',
        error
      );

      return res.status(500).json({
        status: 'error',
        message:
          'Failed to delete inventory item'
      });
    }
  }
);

// ============================================================
// DASHBOARD
// ============================================================

app.get(
  '/dashboard',
  async (req, res) => {

    try {

      const result =
        await pool.query(
          'SELECT * FROM inventory ORDER BY id'
        );

      const inventory =
        result.rows;

      const memoryUsage =
        (
          process.memoryUsage()
            .heapUsed /
          1024 /
          1024
        ).toFixed(2);

      const uptime =
        Math.floor(
          process.uptime()
        );

      const inventoryRows =
        inventory
          .map(item => {

            const stock =
              Number(item.stock);

            const stockClass =
              stock < 20
                ? 'low-stock'
                : 'good-stock';

            return `
              <tr>

                <td>
                  ${escapeHtml(item.id)}
                </td>

                <td>
                  ${escapeHtml(item.name)}
                </td>

                <td class="center">
                  <span class="${stockClass}">
                    ${stock} units
                  </span>
                </td>

                <td class="price">
                  ${escapeHtml(item.price)}
                </td>

                <td class="center">

                  <button
                    class="delete-button"
                    onclick="deleteInventory('${escapeJs(item.id)}')"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            `;
          })
          .join('');

      res.send(`
<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>
    Inventory Management Dashboard
  </title>

  <style>

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;

      padding: 20px;

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      background: #f7fafc;

      color: #2d3748;
    }

    .dashboard {
      max-width: 1150px;

      margin: 20px auto;

      background: white;

      padding: 30px;

      border-radius: 14px;

      box-shadow:
        0 5px 20px
        rgba(0, 0, 0, 0.08);
    }

    .header {
      display: flex;

      justify-content: space-between;

      align-items: center;

      gap: 20px;

      padding-bottom: 20px;

      border-bottom:
        2px solid #edf2f7;
    }

    .badge {
      display: inline-block;

      background: #3182ce;

      color: white;

      padding: 5px 9px;

      border-radius: 5px;

      font-size: 11px;

      font-weight: bold;

      text-transform: uppercase;
    }

    h1 {
      margin: 8px 0 0;

      color: #1a202c;

      font-size: 28px;
    }

    .status {
      text-align: right;
    }

    .status-dot {
      display: inline-block;

      width: 10px;

      height: 10px;

      background: #48bb78;

      border-radius: 50%;

      margin-right: 5px;
    }

    .logout-button {
      width: auto;

      padding: 8px 15px;

      margin-top: 10px;

      background: #e53e3e;

      color: white;

      border: none;

      border-radius: 6px;

      cursor: pointer;

      font-weight: bold;
    }

    .logout-button:hover {
      background: #c53030;
    }

    .metrics {
      display: grid;

      grid-template-columns:
        repeat(3, 1fr);

      gap: 20px;

      margin: 25px 0 35px;
    }

    .metric {
      padding: 20px;

      border-radius: 8px;

      border-left: 4px solid #3182ce;

      background: #ebf8ff;
    }

    .metric-title {
      font-size: 12px;

      font-weight: bold;

      text-transform: uppercase;

      color: #2b6cb0;
    }

    .metric-value {
      font-size: 24px;

      font-weight: bold;

      margin-top: 8px;
    }

    .section-title {
      margin-top: 25px;

      margin-bottom: 15px;

      color: #4a5568;
    }

    table {
      width: 100%;

      border-collapse: collapse;
    }

    th {
      background: #edf2f7;

      color: #4a5568;

      padding: 13px;

      text-align: left;

      font-size: 12px;

      text-transform: uppercase;
    }

    td {
      padding: 13px;

      border-bottom:
        1px solid #e2e8f0;
    }

    .center {
      text-align: center;
    }

    .price {
      text-align: right;

      font-weight: bold;

      color: #2b6cb0;
    }

    .good-stock,
    .low-stock {
      display: inline-block;

      padding: 5px 9px;

      border-radius: 5px;

      font-size: 13px;
    }

    .good-stock {
      background: #c6f6d5;

      color: #22543d;
    }

    .low-stock {
      background: #fed7d7;

      color: #9b2c2c;
    }

    .delete-button {
      width: auto;

      padding: 7px 12px;

      background: #e53e3e;

      color: white;

      border: none;

      border-radius: 6px;

      cursor: pointer;

      font-weight: bold;
    }

    .delete-button:hover {
      background: #c53030;
    }

    .add-section {
      margin-top: 35px;

      padding-top: 25px;

      border-top:
        2px solid #edf2f7;
    }

    .add-form {
      display: grid;

      grid-template-columns:
        1fr 2fr 1fr 1fr auto;

      gap: 10px;

      align-items: end;
    }

    .field label {
      display: block;

      margin-bottom: 5px;

      font-size: 12px;

      font-weight: bold;
    }

    .form-input {
      width: 100%;

      padding: 10px;

      border:
        1px solid #cbd5e0;

      border-radius: 6px;

      font-size: 14px;
    }

    .add-button {
      width: auto;

      padding: 10px 18px;

      background: #3182ce;

      color: white;

      border: none;

      border-radius: 6px;

      font-weight: bold;

      cursor: pointer;
    }

    .add-button:hover {
      background: #2b6cb0;
    }

    #inventoryMessage {
      margin-top: 15px;

      padding: 10px;

      border-radius: 6px;

      display: none;
    }

    .message-success {
      display: block !important;

      background: #c6f6d5;

      color: #22543d;
    }

    .message-error {
      display: block !important;

      background: #fed7d7;

      color: #9b2c2c;
    }

    .footer {
      margin-top: 25px;

      padding-top: 15px;

      border-top:
        1px solid #edf2f7;

      color: #718096;

      font-size: 12px;

      text-align: center;
    }

    @media (max-width: 900px) {

      .metrics {
        grid-template-columns: 1fr;
      }

      .add-form {
        grid-template-columns: 1fr;
      }

      .header {
        flex-direction: column;

        align-items: flex-start;
      }

      .status {
        text-align: left;
      }

      table {
        font-size: 12px;
      }

    }

  </style>

</head>

<body>

  <div class="dashboard">

    <div class="header">

      <div>

        <span class="badge">
          Microservice Architecture
        </span>

        <h1>
          Inventory & Order
          Management Platform
        </h1>

      </div>

      <div class="status">

        <div>

          <span class="status-dot"></span>

          <strong>
            Service: Healthy
          </strong>

        </div>

        <button
          class="logout-button"
          onclick="logout()"
        >
          Logout
        </button>

      </div>

    </div>

    <h3 class="section-title">
      📊 Live DevOps Application Metrics
    </h3>

    <div class="metrics">

      <div class="metric">

        <div class="metric-title">
          Container Memory Usage
        </div>

        <div class="metric-value">
          ${memoryUsage} MB
        </div>

      </div>

      <div class="metric">

        <div class="metric-title">
          API Status
        </div>

        <div class="metric-value">
          Healthy
        </div>

      </div>

      <div class="metric">

        <div class="metric-title">
          Application Uptime
        </div>

        <div class="metric-value">
          ${uptime}s
        </div>

      </div>

    </div>

    <h3 class="section-title">
      📦 Live Real-Time Inventory Database
    </h3>

    <table>

      <thead>

        <tr>

          <th>
            SKU / ID
          </th>

          <th>
            Product Name
          </th>

          <th class="center">
            Stock Status
          </th>

          <th class="price">
            Unit Price
          </th>

          <th class="center">
            Actions
          </th>

        </tr>

      </thead>

      <tbody>

        ${
          inventoryRows ||
          `
          <tr>
            <td colspan="5" class="center">
              No inventory items found.
            </td>
          </tr>
          `
        }

      </tbody>

    </table>

    <div class="add-section">

      <h3 class="section-title">
        ➕ Add New Inventory
      </h3>

      <form
        id="addInventoryForm"
        class="add-form"
      >

        <div class="field">

          <label for="productId">
            Product ID
          </label>

          <input
            id="productId"
            class="form-input"
            type="text"
            placeholder="PROD-005"
            required
          >

        </div>

        <div class="field">

          <label for="productName">
            Product Name
          </label>

          <input
            id="productName"
            class="form-input"
            type="text"
            placeholder="Product name"
            required
          >

        </div>

        <div class="field">

          <label for="productStock">
            Stock
          </label>

          <input
            id="productStock"
            class="form-input"
            type="number"
            min="0"
            placeholder="50"
            required
          >

        </div>

        <div class="field">

          <label for="productPrice">
            Price
          </label>

          <input
            id="productPrice"
            class="form-input"
            type="text"
            placeholder="$99"
            required
          >

        </div>

        <button
          class="add-button"
          type="submit"
        >
          Add
        </button>

      </form>

      <div id="inventoryMessage"></div>

    </div>

    <div class="footer">
      DevOps Inventory Platform |
      Node.js |
      PostgreSQL |
      Docker
    </div>

  </div>

  <script>

    function getToken() {
      return localStorage.getItem(
        'inventory_token'
      );
    }

    function logout() {

      localStorage.removeItem(
        'inventory_token'
      );

      localStorage.removeItem(
        'inventory_user'
      );

      window.location.href =
        '/login';
    }

    async function deleteInventory(id) {

      if (
        !confirm(
          'Are you sure you want to delete this item?'
        )
      ) {
        return;
      }

      const token = getToken();

      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {

        const response =
          await fetch(
            '/api/v1/inventory/' +
            encodeURIComponent(id),
            {
              method: 'DELETE',

              headers: {
                Authorization:
                  'Bearer ' + token
              }
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            'Delete failed'
          );
        }

        window.location.reload();

      } catch (error) {

        alert(
          error.message
        );
      }
    }

    const addForm =
      document.getElementById(
        'addInventoryForm'
      );

    const inventoryMessage =
      document.getElementById(
        'inventoryMessage'
      );

    addForm.addEventListener(
      'submit',
      async (event) => {

        event.preventDefault();

        const token =
          getToken();

        if (!token) {
          window.location.href = '/login';
          return;
        }

        const id =
          document
            .getElementById('productId')
            .value
            .trim();

        const name =
          document
            .getElementById('productName')
            .value
            .trim();

        const stock =
          Number(
            document
              .getElementById('productStock')
              .value
          );

        const price =
          document
            .getElementById('productPrice')
            .value
            .trim();

        inventoryMessage.className = '';
        inventoryMessage.style.display =
          'none';

        try {

          const response =
            await fetch(
              '/api/v1/inventory',
              {
                method: 'POST',

                headers: {
                  'Content-Type':
                    'application/json',

                  Authorization:
                    'Bearer ' + token
                },

                body:
                  JSON.stringify({
                    id,
                    name,
                    stock,
                    price
                  })
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
              'Failed to add inventory'
            );
          }

          inventoryMessage.textContent =
            'Inventory item added successfully.';

          inventoryMessage.className =
            'message-success';

          addForm.reset();

          setTimeout(() => {
            window.location.reload();
          }, 700);

        } catch (error) {

          inventoryMessage.textContent =
            error.message;

          inventoryMessage.className =
            'message-error';
        }
      }
    );

  </script>

</body>
</html>
      `);

    } catch (error) {

      console.error(
        'Dashboard error:',
        error
      );

      return res.status(500).send(
        'Unable to load dashboard'
      );
    }
  }
);

// ============================================================
// ESCAPE HELPERS
// ============================================================

function escapeHtml(value) {

  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeJs(value) {

  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
}

// ============================================================
// 404 HANDLER
// ============================================================

app.use((req, res) => {

  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl
  });
});

// ============================================================
// ERROR HANDLER
// ============================================================

app.use((err, req, res, next) => {

  console.error(
    'Unhandled error:',
    err
  );

  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

// ============================================================
// START SERVER
// ============================================================

async function startServer() {

  try {

    await pool.query('SELECT 1');

    console.log(
      'PostgreSQL connection successful'
    );

    app.listen(
      PORT,
      '0.0.0.0',
      () => {

        console.log(
          `Server running on port ${PORT}`
        );

      }
    );

  } catch (error) {

    console.error(
      'Unable to connect to PostgreSQL:',
      error
    );

    process.exit(1);
  }
}

startServer();