import Component from "../models/ComponentModel.js";

/**
 * Mengambil semua daftar komponen UI yang tersedia.
 * @route GET /api/components
 * @access Public (User & Admin)
 */
export const getAllComponents = async (req, res) => {
  try {
    const components = await Component.findAll();
    res.status(200).json(components);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Mengambil detail satu komponen berdasarkan ID.
 * @route GET /api/components/:id
 * @access Public
 */
export const getComponentById = async (req, res) => {
  try {
    const { id } = req.params;
    const component = await Component.findByPk(id);

    if (!component) {
      return res.status(404).json({ message: "Component not found" });
    }

    res.status(200).json(component);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Membuat komponen UI baru (Master Data).
 * @route POST /api/components
 * @access Admin Only
 * @param {string} req.body.html_code - Kode HTML komponen
 * @param {string} req.body.css_code - Kode CSS komponen
 */
export const createComponent = async (req, res) => {
  try {
    const { name, category, preview_url, html_code, css_code, js_code } = req.body;

    const newComponent = await Component.create({
      name,
      category,
      preview_url,
      html_code,
      css_code,
      js_code,
    });

    res.status(201).json(newComponent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Mengupdate data komponen yang sudah ada.
 * @route PATCH /api/components/:id
 * @access Admin Only
 */
export const updateComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, preview_url, html_code, css_code, js_code } = req.body;

    const component = await Component.findByPk(id);
    if (!component) {
      return res.status(404).json({ message: "Component not found" });
    }

    await component.update({
      name,
      category,
      preview_url,
      html_code,
      css_code,
      js_code,
    });

    res.status(200).json(component);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Menghapus komponen dari database.
 * @route DELETE /api/components/:id
 * @access Admin Only
 */
export const deleteComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const component = await Component.findByPk(id);

    if (!component) {
      return res.status(404).json({ message: "Component not found" });
    }

    await component.destroy();
    res.status(200).json({ message: "Component deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};