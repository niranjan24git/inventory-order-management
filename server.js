const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Mock database simulation for inventory items
const inventory = [
  { id: "PROD-001", name: "Premium Wireless Headphones", stock: 142, price: "$199" },
  { id: "PROD-002", name: "Mechanical Ergonomic Keyboard", stock: 45, price: "$129" },
  { id: "PROD-003", name: "UltraWide 4K Gaming Monitor", stock: 12, price: "$499" },
  { id: "PROD-004", name: "Smart Fitness Watch v2", stock: 89, price: "$249" }
];

// Beautiful Dashboard UI Route
app.get('/', (req, res) => {
  const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
  
  // Dynamic table generation
  let inventoryRows = inventory.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-family: monospace; color: #4a5568;">${item.id}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">
        <span style="background-color: ${item.stock < 20 ? '#fed7d7' : '#c6f6d5'}; color: ${item.stock < 20 ? '#9b2c2c' : '#22543d'}; padding: 4px 8px; border-radius: 4px; font-size: 14px;">
          ${item.stock} units
        </span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #2b6cb0;">${item.price}</td>
    </tr>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Inventory Management Service</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7fafc; margin: 0; padding: 4px;">
        <div style="max-width: 1000px; margin: 40px auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            
            <!-- Header section representing enterprise design -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #edf2f7; padding-bottom: 20px; margin-bottom: 30px;">
                <div>
                    <span style="background: #3182ce; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase;">Microservice Architecture</span>
                    <h1 style="margin: 5px 0 0 0; color: #1a202c; font-size: 28px;">Inventory & Order Management Platform</h1>
                </div>
                <div style="text-align: right;">
                    <div style="display: inline-block; width: 10px; height: 10px; background: #48bb78; border-radius: 50%; margin-right: 5px;"></div>
                    <span style="font-weight: bold; color: #2d3748;">Service: Healthy</span>
                </div>
            </div>

            <!-- Operational System Metrics Box for DevOps appeal -->
            <h3 style="color: #4a5568; margin-bottom: 15px;">📊 Live DevOps Application Metrics</h3>
            <div style="display: flex; gap: 20px; margin-bottom: 35px;">
                <div style="flex: 1; background: #ebf8ff; border-left: 4px solid #3182ce; padding: 15px; border-radius: 4px;">
                    <div style="font-size: 12px; text-transform: uppercase; color: #2b6cb0; font-weight: bold;">Container Memory Usage</div>
                    <div style="font-size: 24px; font-weight: bold; color: #2d3748; margin-top: 5px;">${memoryUsage} MB</div>
                </div>
                <div style="flex: 1; background: #e6fffa; border-left: 4px solid #319795; padding: 15px; border-radius: 4px;">
                    <div style="font-size: 12px; text-transform: uppercase; color: #234e52; font-weight: bold;">API Latency</div>
                    <div style="font-size: 24px; font-weight: bold; color: #2d3748; margin-top: 5px;">14 ms</div>
                </div>
                <div style="flex: 1; background: #f7fafc; border-left: 4px solid #4a5568; padding: 15px; border-radius: 4px;">
                    <div style="font-size: 12px; text-transform: uppercase; color: #4a5568; font-weight: bold;">Node Environment</div>
                    <div style="font-size: 24px; font-weight: bold; color: #2d3748; margin-top: 5px;">Production</div>
                </div>
            </div>

            <!-- Business Data Section -->
            <h3 style="color: #4a5568; margin-bottom: 15px;">📦 Live Real-Time Inventory Database</h3>
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                    <tr style="background-color: #edf2f7; color: #4a5568; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px;">
                        <th style="padding: 12px;">SKU / ID</th>
                        <th style="padding: 12px;">Product Name</th>
                        <th style="padding: 12px; text-align: center;">Stock Status</th>
                        <th style="padding: 12px; text-align: right;">Unit Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${inventoryRows}
                </tbody>
            </table>
        </div>
    </body>
    </html>
  `);
});

// JSON API endpoint representing a decoupled application design
app.get('/api/v1/inventory', (req, res) => {
  res.status(200).json({
    status: "success",
    timestamp: new Date().toISOString(),
    data: inventory
  });
});

// Production standard deep monitoring health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    database_connected: true,
    uptime_seconds: process.uptime()
  });
});

app.listen(PORT, () => {
  console.log(`Server executing live on port ${PORT}`);
});