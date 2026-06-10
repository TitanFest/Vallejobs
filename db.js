const supabase = require("./supabaseClient");
const bcrypt = require("bcrypt");

// ─── USERS ───────────────────────────────────────────────
const findUserByPk = async (id, options = {}) => {
  let query = supabase
    .from("users")
    .select(options.select || "*")
    .eq("id", id)
    .maybeSingle();
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

const findUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();
  if (error) throw error;
  return data;
};

const findAllUsers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, name, apellido, email, documento, telefono, foto, cv, ubicacion, descripcion, rating_empleador, rating_empleado, rol",
    );
  if (error) throw error;
  return data;
};

const createUser = async (userData) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(userData.password, salt);
  const { data, error } = await supabase
    .from("users")
    .insert({ ...userData, password: hashedPassword })
    .select(
      "id, name, apellido, email, documento, telefono, foto, cv, ubicacion, descripcion, rating_empleador, rating_empleado, rol",
    )
    .single();
  if (error) throw error;
  return data;
};

const updateUser = async (id, userData) => {
  const payload = { ...userData, updatedAt: new Date().toISOString() };
  if (payload.password) {
    const salt = bcrypt.genSaltSync(10);
    payload.password = bcrypt.hashSync(payload.password, salt);
  }
  const { data, error } = await supabase
    .from("users")
    .update(payload)
    .eq("id", id)
    .select(
      "id, name, apellido, email, documento, telefono, foto, cv, ubicacion, descripcion, rating_empleador, rating_empleado, rol",
    )
    .single();
  if (error) throw error;
  return data;
};

const deleteUser = async (id) => {
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) throw error;
  return true;
};

// ─── CATEGORIAS ──────────────────────────────────────────
const findAllCategorias = async () => {
  const { data, error } = await supabase
    .from("categoria")
    .select("*")
    .order("id");
  if (error) throw error;
  return data;
};

const findCategoriaByNombre = async (nombre) => {
  const { data, error } = await supabase
    .from("categoria")
    .select("*")
    .eq("nombre", nombre)
    .maybeSingle();
  if (error) throw error;
  return data;
};

const findCategoriaByPk = async (id) => {
  const { data, error } = await supabase
    .from("categoria")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
};

const createCategoria = async (data) => {
  const { data: result, error } = await supabase
    .from("categoria")
    .insert(data)
    .select("*")
    .single();
  if (error) throw error;
  return result;
};

const updateCategoria = async (id, data) => {
  const { data: result, error } = await supabase
    .from("categoria")
    .update({ ...data, updatedAt: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return result;
};

const deleteCategoria = async (id) => {
  const { error } = await supabase.from("categoria").delete().eq("id", id);
  if (error) throw error;
  return true;
};

// ─── OFERTAS TRABAJO ─────────────────────────────────────
const findAllOfertas = async () => {
  const { data, error } = await supabase
    .from("ofertasTrabajo")
    .select("*, categoria: categoriaId(*)")
    .order("id", { ascending: false });
  if (error) throw error;
  return data;
};

const findOfertaByPk = async (id) => {
  const { data, error } = await supabase
    .from("ofertasTrabajo")
    .select("*, categoria: categoriaId(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
};

const createOferta = async (data, retries = 3) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    const { data: result, error } = await supabase
      .from("ofertasTrabajo")
      .insert({ ...data })
      .select("*, categoria: categoriaId(*)")
      .single();
    if (!error) return result;
    if (error.code === "23505") {
      const { data: maxRow } = await supabase
        .from("ofertasTrabajo")
        .select("id")
        .order("id", { ascending: false })
        .limit(1)
        .single();
      data.id = (maxRow?.id || 0) + 1;
      continue;
    }
    throw error;
  }
  throw new Error("No se pudo crear la oferta tras varios intentos");
};

const updateOferta = async (id, data) => {
  const { data: result, error } = await supabase
    .from("ofertasTrabajo")
    .update({ ...data, updatedAt: new Date().toISOString() })
    .eq("id", id)
    .select("*, categoria: categoriaId(*)")
    .single();
  if (error) throw error;
  return result;
};

const deleteOferta = async (id) => {
  const { error } = await supabase.from("ofertasTrabajo").delete().eq("id", id);
  if (error) throw error;
  return true;
};

const findOfertasByUserId = async (userId) => {
  const { data, error } = await supabase
    .from("ofertasTrabajo")
    .select("*, categoria: categoriaId(*), postulaciones: postulaciones(*)")
    .eq("userId", userId)
    .order("id", { ascending: false });
  if (error) throw error;
  return data;
};

const findOfertasByCategoriaNombre = async (nombre) => {
  const { data: cat } = await supabase
    .from("categoria")
    .select("id")
    .eq("nombre", nombre)
    .maybeSingle();
  if (!cat) return [];
  const { data, error } = await supabase
    .from("ofertasTrabajo")
    .select("*, categoria: categoriaId(*)")
    .eq("categoriaId", cat.id)
    .order("id", { ascending: false });
  if (error) throw error;
  return data;
};

// ─── POSTULACIONES ───────────────────────────────────────
const createPostulacion = async (data, retries = 3) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    const { data: result, error } = await supabase
      .from("postulaciones")
      .insert({ ...data })
      .select("*")
      .single();
    if (!error) return result;
    if (error.code === "23505") {
      const { data: maxRow } = await supabase
        .from("postulaciones")
        .select("id")
        .order("id", { ascending: false })
        .limit(1)
        .single();
      data.id = (maxRow?.id || 0) + 1;
      continue;
    }
    throw error;
  }
  throw new Error("No se pudo crear la postulación tras varios intentos");
};

const findPostulacionesByUserId = async (userId) => {
  const { data, error } = await supabase
    .from("postulaciones")
    .select("*, oferta: ofertaId(*)")
    .eq("userId", userId)
    .order("id", { ascending: false });
  if (error) throw error;
  return data;
};

const findPostulacionesByOfertaId = async (ofertaId) => {
  const { data, error } = await supabase
    .from("postulaciones")
    .select(
      "*, postulante: userId(id, name, apellido, email, foto, cv, ubicacion, descripcion)",
    )
    .eq("ofertaId", ofertaId)
    .order("id");
  if (error) throw error;
  return data;
};

const updatePostulacionEstado = async (id, estado) => {
  const { data, error } = await supabase
    .from("postulaciones")
    .update({ estado, updatedAt: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
};

module.exports = {
  findUserByPk,
  findUserByEmail,
  findAllUsers,
  createUser,
  updateUser,
  deleteUser,
  findAllCategorias,
  findCategoriaByNombre,
  findCategoriaByPk,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  findAllOfertas,
  findOfertaByPk,
  createOferta,
  updateOferta,
  deleteOferta,
  findOfertasByUserId,
  findOfertasByCategoriaNombre,
  createPostulacion,
  findPostulacionesByUserId,
  findPostulacionesByOfertaId,
  updatePostulacionEstado,
};
