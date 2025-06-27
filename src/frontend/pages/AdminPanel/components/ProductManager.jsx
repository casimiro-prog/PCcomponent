import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { toastHandler } from '../../../utils/utils';
import { ToastType } from '../../../constants/constants';
import styles from './ProductManager.module.css';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const initialProductState = {
    name: '',
    price: '',
    originalPrice: '',
    description: '',
    category: '',
    company: '',
    stock: '',
    reviewCount: '',
    stars: '',
    isShippingAvailable: true,
    featured: false,
    colors: [{ color: '#000000', colorQuantity: 0 }],
    image: null
  };

  const [productForm, setProductForm] = useState(initialProductState);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleColorChange = (index, field, value) => {
    const newColors = [...productForm.colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setProductForm(prev => ({ ...prev, colors: newColors }));
  };

  const addColor = () => {
    setProductForm(prev => ({
      ...prev,
      colors: [...prev.colors, { color: '#000000', colorQuantity: 0 }]
    }));
  };

  const removeColor = (index) => {
    if (productForm.colors.length > 1) {
      const newColors = productForm.colors.filter((_, i) => i !== index);
      setProductForm(prev => ({ ...prev, colors: newColors }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProductForm(prev => ({ ...prev, image: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!productForm.name.trim()) {
      toastHandler(ToastType.Error, 'El nombre del producto es requerido');
      return;
    }
    
    if (!productForm.price || productForm.price <= 0) {
      toastHandler(ToastType.Error, 'El precio debe ser mayor a 0');
      return;
    }

    const newProduct = {
      ...productForm,
      _id: editingProduct ? editingProduct._id : uuid(),
      price: parseFloat(productForm.price),
      originalPrice: parseFloat(productForm.originalPrice) || parseFloat(productForm.price),
      stock: parseInt(productForm.stock) || 0,
      reviewCount: parseInt(productForm.reviewCount) || 0,
      stars: parseFloat(productForm.stars) || 0,
      colors: productForm.colors.map(color => ({
        ...color,
        colorQuantity: parseInt(color.colorQuantity) || 0
      }))
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p._id === editingProduct._id ? newProduct : p));
      toastHandler(ToastType.Success, 'Producto actualizado exitosamente');
    } else {
      setProducts(prev => [...prev, newProduct]);
      toastHandler(ToastType.Success, 'Producto creado exitosamente');
    }

    resetForm();
  };

  const resetForm = () => {
    setProductForm(initialProductState);
    setEditingProduct(null);
    setShowForm(false);
  };

  const editProduct = (product) => {
    setProductForm(product);
    setEditingProduct(product);
    setShowForm(true);
  };

  const deleteProduct = (productId) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setProducts(prev => prev.filter(p => p._id !== productId));
      toastHandler(ToastType.Success, 'Producto eliminado exitosamente');
    }
  };

  return (
    <div className={styles.productManager}>
      <div className={styles.header}>
        <h2>Gestión de Productos</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : '+ Nuevo Producto'}
        </button>
      </div>

      {showForm && (
        <form className={styles.productForm} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Nombre del Producto *</label>
              <input
                type="text"
                name="name"
                value={productForm.name}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Precio *</label>
              <input
                type="number"
                name="price"
                value={productForm.price}
                onChange={handleInputChange}
                className="form-input"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Precio Original</label>
              <input
                type="number"
                name="originalPrice"
                value={productForm.originalPrice}
                onChange={handleInputChange}
                className="form-input"
                min="0"
                step="0.01"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Categoría</label>
              <select
                name="category"
                value={productForm.category}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Seleccionar categoría</option>
                <option value="laptop">Laptop</option>
                <option value="tv">TV</option>
                <option value="smartwatch">Smartwatch</option>
                <option value="earphone">Auriculares</option>
                <option value="mobile">Móvil</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Marca</label>
              <input
                type="text"
                name="company"
                value={productForm.company}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Stock Total</label>
              <input
                type="number"
                name="stock"
                value={productForm.stock}
                onChange={handleInputChange}
                className="form-input"
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Número de Reseñas</label>
              <input
                type="number"
                name="reviewCount"
                value={productForm.reviewCount}
                onChange={handleInputChange}
                className="form-input"
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Calificación (Estrellas)</label>
              <input
                type="number"
                name="stars"
                value={productForm.stars}
                onChange={handleInputChange}
                className="form-input"
                min="0"
                max="5"
                step="0.1"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Descripción</label>
            <textarea
              name="description"
              value={productForm.description}
              onChange={handleInputChange}
              className="form-textarea"
              rows="4"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Imagen del Producto</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="form-input"
            />
            {productForm.image && (
              <div className={styles.imagePreview}>
                <img src={productForm.image} alt="Preview" />
              </div>
            )}
          </div>

          <div className={styles.colorsSection}>
            <label>Colores y Stock por Color</label>
            {productForm.colors.map((color, index) => (
              <div key={index} className={styles.colorRow}>
                <input
                  type="color"
                  value={color.color}
                  onChange={(e) => handleColorChange(index, 'color', e.target.value)}
                  className={styles.colorPicker}
                />
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={color.colorQuantity}
                  onChange={(e) => handleColorChange(index, 'colorQuantity', e.target.value)}
                  className="form-input"
                  min="0"
                />
                {productForm.colors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="btn btn-danger"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addColor}
              className="btn btn-hipster"
            >
              + Agregar Color
            </button>
          </div>

          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                name="isShippingAvailable"
                checked={productForm.isShippingAvailable}
                onChange={handleInputChange}
              />
              Envío disponible
            </label>
            <label>
              <input
                type="checkbox"
                name="featured"
                checked={productForm.featured}
                onChange={handleInputChange}
              />
              Producto destacado
            </label>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className="btn btn-primary">
              {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
            <button type="button" onClick={resetForm} className="btn btn-hipster">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className={styles.productsList}>
        <h3>Productos Existentes ({products.length})</h3>
        {products.length === 0 ? (
          <p className={styles.emptyMessage}>No hay productos creados aún.</p>
        ) : (
          <div className={styles.productsGrid}>
            {products.map(product => (
              <div key={product._id} className={styles.productCard}>
                {product.image && (
                  <div className={styles.productImage}>
                    <img src={product.image} alt={product.name} />
                  </div>
                )}
                <div className={styles.productInfo}>
                  <h4>{product.name}</h4>
                  <p>Precio: ${product.price} CUP</p>
                  <p>Stock: {product.stock}</p>
                  <p>Categoría: {product.category}</p>
                  <div className={styles.productActions}>
                    <button
                      onClick={() => editProduct(product)}
                      className="btn btn-primary"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="btn btn-danger"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManager;