import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function importFile(filename: string, model: any, mapper: (data: any) => any) {
    if (!fs.existsSync(filename)) {
        console.log(`Skipping ${filename}, file not found.`);
        return;
    }
    const items = JSON.parse(fs.readFileSync(filename, 'utf8'));
    console.log(`Importing ${items.length} records from ${filename}...`);

    for (const item of items) {
        try {
            const data = mapper(item);
            await model.upsert({
                where: { id: data.id },
                update: data,
                create: data,
            });
        } catch (err: any) {
            console.error(`❌ Error in ${filename} ID ${item.id}:`, err.message);
        }
    }
    console.log(`Finished ${filename}.`);
}

async function main() {
    // 1. Users (if any)
    await importFile('auth_user_dump.json', prisma.auth_user, (item) => ({
        id: item.id,
        password: item.password,
        last_login: item.last_login ? new Date(item.last_login) : null,
        is_superuser: Boolean(item.is_superuser),
        username: item.username,
        last_name: item.last_name || "",
        email: item.email || "",
        is_staff: Boolean(item.is_staff),
        is_active: Boolean(item.is_active),
        date_joined: new Date(item.date_joined),
        first_name: item.first_name || "",
    }));

    // 2. Projects
    await importFile('data_entry_proyecto_dump.json', prisma.data_entry_proyecto, (item) => ({
        id: item.id,
        nombre: item.nombre,
        descripcion: item.descripcion || "",
        direccion: item.direccion,
        estado: item.estado,
        fecha_creacion: new Date(item.fecha_creacion),
        fecha_actualizacion: new Date(item.fecha_actualizacion),
    }));

    // 3. Buildings
    await importFile('data_entry_edificio_dump.json', prisma.data_entry_edificio, (item) => ({
        id: item.id,
        nombre: item.nombre,
        direccion: item.direccion,
        estado: item.estado,
        pisos: item.pisos,
        unidades: item.unidades,
        fecha_construccion: item.fecha_construccion ? new Date(item.fecha_construccion) : null,
        descripcion: item.descripcion,
        imagen: item.imagen,
        plano: item.plano,
        fecha_creacion: new Date(item.fecha_creacion),
        fecha_actualizacion: new Date(item.fecha_actualizacion),
    }));

    // 4. Closers
    await importFile('data_entry_closer_dump.json', prisma.data_entry_closer, (item) => ({
        id: item.id,
        nombre: item.nombre,
        email: item.email,
        telefono: item.telefono,
        activo: Boolean(item.activo),
        fecha_creacion: new Date(item.fecha_creacion),
        fecha_actualizacion: new Date(item.fecha_actualizacion),
        user_id: item.user_id,
    }));

    // 5. Liners
    await importFile('data_entry_liner_dump.json', prisma.data_entry_liner, (item) => ({
        id: item.id,
        nombre: item.nombre,
        email: item.email,
        telefono: item.telefono,
        activo: Boolean(item.activo),
        fecha_creacion: new Date(item.fecha_creacion),
        fecha_actualizacion: new Date(item.fecha_actualizacion),
        rol_id: item.rol_id,
        user_id: item.user_id,
        broker_id: item.broker_id,
        empresa: item.empresa,
        closer_id: item.closer_id,
    }));

    // 6. Brokers
    await importFile('data_entry_broker_dump.json', prisma.data_entry_broker, (item) => ({
        id: item.id,
        nombre: item.nombre,
        email: item.email,
        telefono: item.telefono,
        activo: Boolean(item.activo),
        fecha_creacion: new Date(item.fecha_creacion),
        fecha_actualizacion: new Date(item.fecha_actualizacion),
        user_id: item.user_id,
        rol_id: item.rol_id,
        empresa: item.empresa,
        closer_id: item.closer_id,
    }));

    // 7. Properties (The main goal)
    await importFile('data_entry_propiedad_dump.json', prisma.data_entry_propiedad, (item) => ({
        id: item.id,
        codigo: item.codigo,
        nombre: item.nombre,
        descripcion: item.descripcion,
        precio: item.precio ? Number(item.precio) : null,
        precio_base: item.precio_base ? Number(item.precio_base) : null,
        precio_reserva: item.precio_reserva ? Number(item.precio_reserva) : null,
        area: item.area ? Number(item.area) : null,
        habitaciones: item.habitaciones,
        banos: item.banos,
        tipo: item.tipo,
        estado: item.estado,
        fecha_creacion: new Date(item.fecha_creacion),
        fecha_actualizacion: new Date(item.fecha_actualizacion),
        imagen_principal: item.imagen_principal,
        nivel: String(item.nivel || "1"),
        apartamento: String(item.apartamento || ""),
        orientacion: item.orientacion || "",
        vistas: item.vistas || "",
        m2_totales: item.m2_totales ? Number(item.m2_totales) : null,
        pies_totales: item.pies_totales ? Number(item.pies_totales) : null,
        m2_interior: item.m2_interior ? Number(item.m2_interior) : null,
        pies_interior: item.pies_interior ? Number(item.pies_interior) : null,
        m2_terraza: item.m2_terraza ? Number(item.m2_terraza) : null,
        pies_terraza: item.pies_terraza ? Number(item.pies_terraza) : null,
        plano: item.plano,
        caracteristicas: item.caracteristicas || "",
        broker_id: item.broker_id,
        edificio_id: item.edificio_id,
        proyecto_id: item.proyecto_id,
        dias_reserva: item.dias_reserva || 0,
        fecha_reserva: item.fecha_reserva ? new Date(item.fecha_reserva) : null,
        autorizado_por_id: item.autorizado_por_id,
        dias_bloqueo: item.dias_bloqueo || 0,
        fecha_autorizacion: item.fecha_autorizacion ? new Date(item.fecha_autorizacion) : null,
        fecha_bloqueo: item.fecha_bloqueo ? new Date(item.fecha_bloqueo) : null,
        fecha_contrato: item.fecha_contrato ? new Date(item.fecha_contrato) : null,
        fecha_pago_inicial: item.fecha_pago_inicial ? new Date(item.fecha_pago_inicial) : null,
        fecha_pago_reserva: item.fecha_pago_reserva ? new Date(item.fecha_pago_reserva) : null,
        pago_inicial_realizado: Boolean(item.pago_inicial_realizado),
        pago_reserva_realizado: Boolean(item.pago_reserva_realizado),
        proyecto_autorizado: Boolean(item.proyecto_autorizado),
        reservada_por_id: item.reservada_por_id,
        closer_id: item.closer_id,
        liner_id: item.liner_id,
    }));

    // 8. Clients
    await importFile('data_entry_cliente_dump.json', prisma.data_entry_cliente, (item) => ({
        id: item.id,
        nombre: item.nombre,
        email: item.email,
        telefono: item.telefono,
        activo: Boolean(item.activo),
        fecha_creacion: new Date(item.fecha_creacion),
        tipo_interes: item.tipo_interes || "",
        presupuesto: item.presupuesto ? Number(item.presupuesto) : null,
        notas: item.notas || "",
    }));

    console.log("Migration finished successfully.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
