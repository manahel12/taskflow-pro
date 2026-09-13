import Category from "../models/Category.js";

export async function getCategories(req, res, next) {
  try {
    let categories = await Category.find({ user: req.user._id }).sort({ name: 1 });
    if (!categories.length) {
      const defaults = ["Work", "Personal", "Shopping", "Health", "Others"];
      await Category.insertMany(defaults.map(name => ({
        name, user: req.user._id, isDefault: true
      })));
      categories = await Category.find({ user: req.user._id }).sort({ name: 1 });
    }
    res.json(categories);
  } catch (err) { next(err); }
}

export async function createCategory(req, res, next) {
  try {
    const { name, icon, color } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Category name is required" });
    const category = await Category.create({
      name: name.trim(), icon: icon || "📁", color: color || "#6366f1", user: req.user._id
    });
    res.status(201).json(category);
  } catch (err) { next(err); }
}

export async function updateCategory(req, res, next) {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) { next(err); }
}

export async function deleteCategory(req, res, next) {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, user: req.user._id, isDefault: false });
    if (!category) return res.status(404).json({ message: "Custom category not found" });
    res.json({ message: "Category deleted successfully" });
  } catch (err) { next(err); }
}
