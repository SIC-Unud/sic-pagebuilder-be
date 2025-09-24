import Component from "../models/ComponentModel.js";

// Get all components
export const getAllComponents = async (req, res) => {
  try {
    const components = await Component.findAll();
    res.status(200).json(components);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get component by ID
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

// Create component
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

// Update component
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

// Delete component
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