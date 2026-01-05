<?php
// --- CONEXIÓN Y CONFIGURACIÓN ---
$conn = new mysqli("localhost", "root", "", "sistema_pagos");
if ($conn->connect_error) { die("Error de conexión"); }
$conn->set_charset("utf8mb4");

// --- LÓGICA DE EXPORTACIÓN CSV ---
if (isset($_GET['csv'])) {
    $sede = $_GET['csv'];
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename=Reporte_'.$sede.'.csv');
    $out = fopen('php://output', 'w');
    fputcsv($out, ['Fecha', 'Nombre', 'Apellido', 'Monto', 'Estado']);
    $data = $conn->query("SELECT fecha, nombre, apellido, pago, estado FROM registros WHERE lugar='$sede'");
    while($r = $data->fetch_assoc()) fputcsv($out, $r);
    fclose($out); exit;
}

// --- GUARDAR / ACTUALIZAR ---
if (isset($_POST['btn_guardar'])) {
    $id = $_POST['id_registro'];
    $nom = $_POST['nombre']; $ape = $_POST['apellido'];
    $fec = $_POST['fecha']; $pag = $_POST['pago'];
    $lug = $_POST['lugar']; $est = $_POST['estado'];

    if ($id) {
        $stmt = $conn->prepare("UPDATE registros SET nombre=?, apellido=?, fecha=?, pago=?, lugar=?, estado=? WHERE id=?");
        $stmt->bind_param("sssdssi", $nom, $ape, $fec, $pag, $lug, $est, $id);
    } else {
        $stmt = $conn->prepare("INSERT INTO registros (nombre, apellido, fecha, pago, lugar, estado) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssdss", $nom, $ape, $fec, $pag, $lug, $est);
    }
    $stmt->execute();
    header("Location: index.php");
}

// --- ELIMINAR ---
if (isset($_GET['del'])) {
    $conn->query("DELETE FROM registros WHERE id=".$_GET['del']);
    header("Location: index.php");
}

// --- CONSULTA CON FILTROS ---
$f_lug = $_POST['f_lugar'] ?? '';
$f_fec = $_POST['f_fecha'] ?? '';

$sql = "SELECT * FROM registros WHERE 1=1";
if ($f_lug) $sql .= " AND lugar LIKE '%$f_lug%'";
if ($f_fec) $sql .= " AND fecha = '$f_fec'";
$sql .= " ORDER BY lugar ASC, creado_el DESC";

$res = $conn->query($sql);
$carpetas = [];
while($row = $res->fetch_assoc()) { $carpetas[$row['lugar']][] = $row; }
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FAST NET - Sistema de Tesorería</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --blue: #3182ce; --dark: #1a202c; --gray: #f7fafc; --success: #38a169; }
        body { font-family: 'Segoe UI', sans-serif; background: #edf2f7; margin: 0; color: #2d3748; }
        
        /* Navbar con IP para compartir */
        nav { background: var(--dark); color: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 1000; }
        
        .main-container { max-width: 1200px; margin: 20px auto; padding: 0 15px; }

        /* SECCIÓN 1: FILTROS (AHORA ARRIBA) */
        .search-box { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 20px; border-top: 4px solid var(--blue); }
        
        /* SECCIÓN 2: FORMULARIO */
        .form-card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 30px; }
        
        .grid-layout { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; align-items: flex-end; }
        
        input, select { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; font-size: 14px; }
        label { font-size: 12px; font-weight: bold; color: #4a5568; margin-bottom: 5px; display: block; }

        .btn { padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.3s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-blue { background: var(--blue); color: white; }
        .btn-blue:hover { background: #2b6cb0; }

        /* CARPETAS POR LUGAR */
        .folder { margin-bottom: 40px; }
        .folder-tab { background: #cbd5e0; display: inline-block; padding: 8px 25px; border-radius: 12px 12px 0 0; font-weight: bold; color: #2d3748; border: 2px solid #cbd5e0; border-bottom: none; }
        .folder-content { background: white; border: 2px solid #cbd5e0; border-radius: 0 12px 12px 12px; padding: 20px; overflow-x: auto; }

        /* TABLA EXCEL */
        table { width: 100%; border-collapse: collapse; min-width: 600px; }
        th { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; text-align: left; font-size: 13px; }
        td { border: 1px solid #e2e8f0; padding: 10px; font-size: 14px; }
        tr:hover { background: #f1f5f9; }

        .badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; }
        .paid { background: #c6f6d5; color: #22543d; }
        .pending { background: #fed7d7; color: #822727; }

        @media (max-width: 768px) {
            nav { flex-direction: column; gap: 10px; text-align: center; }
            .grid-layout { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>

<nav>
    <div style="font-size: 20px; font-weight: 900;"><i class="fa-solid fa-wifi"></i> FAST NET</div>
    <div style="font-size: 13px; background: #2d3748; padding: 5px 15px; border-radius: 5px;">
        <i class="fa-solid fa-share-nodes"></i> URL para otros dispositivos: 
        <strong>http://<?php echo gethostbyname(gethostname()); ?>/leyder</strong>
    </div>
</nav>

<div class="main-container">

    <div class="search-box">
        <form method="POST" class="grid-layout" style="grid-template-columns: 1fr 1fr auto auto;">
            <div>
                <label>Buscar por Lugar:</label>
                <input type="text" name="f_lugar" placeholder="Ej: loboyacu" value="<?php echo $f_lug; ?>">
            </div>
            <div>
                <label>Filtrar por Fecha:</label>
                <input type="date" name="f_fecha" value="<?php echo $f_fec; ?>">
            </div>
            <button type="submit" class="btn btn-blue" style="width: 120px;"><i class="fa-solid fa-magnifying-glass"></i> Buscar</button>
            <a href="index.php" class="btn" style="background: #e2e8f0; color: #4a5568; text-decoration: none;">Limpiar</a>
        </form>
    </div>

    <div class="form-card">
        <h3 id="titulo-form" style="margin-top: 0;"><i class="fa-solid fa-circle-plus"></i> Nuevo Registro / Edición</h3>
        <form method="POST" id="form-registro">
            <input type="hidden" name="id_registro" id="id_reg">
            <div class="grid-layout">
                <div>
                    <label>Nombre:</label>
                    <input type="text" name="nombre" id="nom" required>
                </div>
                <div>
                    <label>Apellido:</label>
                    <input type="text" name="apellido" id="ape" required>
                </div>
                <div>
                    <label>Fecha:</label>
                    <input type="date" name="fecha" id="fec" value="<?php echo date('Y-m-d'); ?>">
                </div>
                <div>
                    <label>Pago ($):</label>
                    <input type="number" step="0.01" name="pago" id="pag" required>
                </div>
                <div>
                    <label>Lugar / Sede:</label>
                    <input type="text" name="lugar" id="lug" required>
                </div>
                <div>
                    <label>Estado:</label>
                    <select name="estado" id="est">
                        <option value="Pagado">Pagado</option>
                        <option value="Pendiente">Pendiente</option>
                    </select>
                </div>
            </div>
            <button type="submit" name="btn_guardar" class="btn btn-blue" style="margin-top: 20px; width: 200px;">
                <i class="fa-solid fa-floppy-disk"></i> Guardar Registro
            </button>
        </form>
    </div>

    <?php foreach ($carpetas as $sede => $filas): ?>
        <div class="folder">
            <div class="folder-tab"><i class="fa-solid fa-location-dot"></i> SEDE: <?php echo strtoupper($sede); ?></div>
            <div class="folder-content">
                <div style="display: flex; justify-content: flex-end; gap: 10px; margin-bottom: 15px;">
                    <a href="?csv=<?php echo $sede; ?>" class="btn" style="background: #2f855a; color: white; font-size: 12px; padding: 8px 15px;">
                        <i class="fa-solid fa-file-excel"></i> Excel
                    </a>
                    <button onclick="window.print()" class="btn" style="background: #c53030; color: white; font-size: 12px; padding: 8px 15px;">
                        <i class="fa-solid fa-file-pdf"></i> PDF
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 80px;">Acción</th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Monto</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php $total = 0; foreach ($filas as $f): $total += $f['pago']; ?>
                        <tr>
                            <td>
                                <a href="javascript:void(0)" onclick="editar(<?php echo htmlspecialchars(json_encode($f)); ?>)" style="color: var(--blue); margin-right: 10px;"><i class="fa-solid fa-pen"></i></a>
                                <a href="?del=<?php echo $f['id']; ?>" onclick="return confirm('¿Eliminar?')" style="color: #e53e3e;"><i class="fa-solid fa-trash"></i></a>
                            </td>
                            <td><?php echo date('d/m/Y', strtotime($f['fecha'])); ?></td>
                            <td><?php echo $f['apellido'] . ", " . $f['nombre']; ?></td>
                            <td><strong>$<?php echo number_format($f['pago'], 2); ?></strong></td>
                            <td>
                                <span class="badge <?php echo ($f['estado']=='Pagado') ? 'paid' : 'pending'; ?>">
                                    <?php echo $f['estado']; ?>
                                </span>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                    <tfoot>
                        <tr style="background: #f7fafc; font-weight: bold;">
                            <td colspan="3" style="text-align: right;">TOTAL SEDE:</td>
                            <td colspan="2" style="color: var(--success); font-size: 16px;">$<?php echo number_format($total, 2); ?></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    <?php endforeach; ?>

</div>

<script>
function editar(data) {
    document.getElementById('titulo-form').innerHTML = "<i class='fa-solid fa-pen-to-square'></i> Editando Registro #" + data.id;
    document.getElementById('id_reg').value = data.id;
    document.getElementById('nom').value = data.nombre;
    document.getElementById('ape').value = data.apellido;
    document.getElementById('fec').value = data.fecha;
    document.getElementById('pag').value = data.pago;
    document.getElementById('lug').value = data.lugar;
    document.getElementById('est').value = data.estado;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

</body>
</html>