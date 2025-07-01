import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { toastHandler } from '../../../utils/utils';
import { ToastType } from '../../../constants/constants';
import { useAllProductsContext } from '../../../contexts/ProductsContextProvider';
import { useConfigContext } from '../../../contexts/ConfigContextProvider';
import styles from './CategoryManager.module.css';

const CategoryManager = () => {
  const { categories: categoriesFromContext, updateCategoriesFromAdmin } = useAllProductsContext();
  const { updateCategories } = useConfigContext();
  const [localCategories, setLocalCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const initialCategoryState = {
    categoryName: '',
    categoryImage: '',
    description: ''
  };

  const [categoryForm, setCategoryForm] = useState(initialCategoryState);

  // Cargar categorías desde el contexto
  useEffect(() => {
    setLocalCategories(categoriesFromContext || []);
  }, [categoriesFromContext]);

  // Función para redimensionar imagen a 300x200px (tamaño estándar de categories.js)
  const resizeImage = (file, callback) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Tamaño estándar para categorías: 300x200px
      canvas.width = 300;
      canvas.height = 200;
      
      // Dibujar imagen redimensionada manteniendo proporción
      const aspectRatio = img.width / img.height;
      let drawWidth = 300;
      let drawHeight = 200;
      let offsetX = 0;
      let offsetY = 0;
      
      if (aspectRatio > 300/200) {
        drawHeight = 300 / aspectRatio;
        offsetY = (200 - drawHeight) / 2;
      } else {
        drawWidth = 200 * aspectRatio;
        offsetX = (300 - drawWidth) / 2;
      }
      
      // Fondo blanco
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 300, 200);
      
      // Dibujar imagen centrada
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      
      // Convertir a base64
      const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      callback(resizedDataUrl);
    };
    
    img.src = URL.createObjectURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm(prev => ({
      ...prev,
      [name]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        toastHandler(ToastType.Error, 'Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toastHandler(ToastType.Error, 'La imagen debe ser menor a 5MB');
        return;
      }
      
      // Redimensionar imagen al tamaño estándar
      resizeImage(file, (resizedDataUrl) => {
        setCategoryForm(prev => ({ ...prev, categoryImage: resizedDataUrl }));
        setHasUnsavedChanges(true);
        toastHandler(ToastType.Success, 'Imagen redimensionada a 300x200px automáticamente');
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!categoryForm.categoryName.trim()) {
      toastHandler(ToastType.Error, 'El nombre de la categoría es requerido');
      return;
    }
    
    if (!categoryForm.categoryImage.trim()) {
      toastHandler(ToastType.Error, 'La imagen de la categoría es requerida');
      return;
    }

    // Verificar nombre duplicado
    const isDuplicate = localCategories.some(category => 
      category.categoryName.toLowerCase() === categoryForm.categoryName.toLowerCase() && 
      category._id !== editingCategory?._id
    );

    if (isDuplicate) {
      toastHandler(ToastType.Error, 'Ya existe una categoría con este nombre');
      return;
    }

    // Crear categoría con estructura exacta de categories.js
    const newCategory = {
      "_id": editingCategory ? editingCategory._id : uuid(),
      "categoryName": categoryForm.categoryName.toLowerCase().trim(),
      "categoryImage": categoryForm.categoryImage,
      "description": categoryForm.description || "",
      "id": editingCategory ? editingCategory.id : (localCategories.length + 1).toString()
    };

    let updatedCategories;
    if (editingCategory) {
      updatedCategories = localCategories.map(c => c._id === editingCategory._id ? newCategory : c);
      toastHandler(ToastType.Success, '✅ Categoría actualizada exitosamente');
    } else {
      updatedCategories = [...localCategories, newCategory];
      toastHandler(ToastType.Success, '✅ Categoría creada exitosamente');
    }

    // SINCRONIZACIÓN COMPLETA - Mantener estructura exacta
    setLocalCategories(updatedCategories);
    
    // Actualizar en el contexto de configuración para backup
    updateCategories(updatedCategories);
    
    // Actualizar en el contexto de productos para sincronización inmediata
    updateCategoriesFromAdmin(updatedCategories);
    
    // Disparar evento personalizado para sincronización global
    window.dispatchEvent(new CustomEvent('categoriesUpdated', { 
      detail: { categories: updatedCategories } 
    }));
    
    resetForm();
  };

  const resetForm = () => {
    setCategoryForm(initialCategoryState);
    setEditingCategory(null);
    setShowForm(false);
    setHasUnsavedChanges(false);
  };

  const editCategory = (category) => {
    setCategoryForm({
      categoryName: category.categoryName,
      categoryImage: category.categoryImage,
      description: category.description || ''
    });
    setEditingCategory(category);
    setShowForm(true);
    setHasUnsavedChanges(false);
  };

  const toggleCategoryStatus = (categoryId) => {
    const updatedCategories = localCategories.map(c => 
      c._id === categoryId 
        ? { ...c, disabled: !c.disabled }
        : c
    );

    // SINCRONIZACIÓN COMPLETA
    setLocalCategories(updatedCategories);
    updateCategories(updatedCategories);
    updateCategoriesFromAdmin(updatedCategories);
    
    // Disparar evento personalizado
    window.dispatchEvent(new CustomEvent('categoriesUpdated', { 
      detail: { categories: updatedCategories } 
    }));
    
    const category = localCategories.find(c => c._id === categoryId);
    toastHandler(ToastType.Success, 
      `✅ Categoría ${category.disabled ? 'habilitada' : 'deshabilitada'} exitosamente`
    );
  };

  const deleteCategory = (categoryId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría? Esta acción afectará todos los productos de esta categoría.')) {
      return;
    }

    const updatedCategories = localCategories.filter(c => c._id !== categoryId);
    
    // SINCRONIZACIÓN COMPLETA
    setLocalCategories(updatedCategories);
    updateCategories(updatedCategories);
    updateCategoriesFromAdmin(updatedCategories);
    
    // Disparar evento personalizado
    window.dispatchEvent(new CustomEvent('categoriesUpdated', { 
      detail: { categories: updatedCategories } 
    }));
    
    toastHandler(ToastType.Success, '✅ Categoría eliminada exitosamente');
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm('¿Estás seguro de cancelar? Se perderán los cambios no guardados.')) {
        return;
      }
    }
    resetForm();
  };

  // Verificar si hay cambios pendientes
  const hasChanges = localCategories.length !== categoriesFromContext.length || 
    JSON.stringify(localCategories) !== JSON.stringify(categoriesFromContext);

  return (
    <div className={styles.categoryManager}>
      <div className={styles.header}>
        <h2>📂 Gestión de Categorías</h2>
        <div className={styles.headerActions}>
          {hasChanges && (
            <span className={styles.changesIndicator}>
              🟢 Cambios aplicados en tiempo real
            </span>
          )}
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancelar' : '+ Nueva Categoría'}
          </button>
        </div>
      </div>

      <div className={styles.infoBox}>
        <h4>ℹ️ Información Importante</h4>
        <p>Los cambios se aplican automáticamente en la tienda. Las imágenes se redimensionan automáticamente a 300x200px. Para exportar los cambios permanentemente, ve a la sección "🗂️ Sistema Backup".</p>
      </div>

      {showForm && (
        <form className={styles.categoryForm} onSubmit={handleSubmit}>
          <div className={styles.formHeader}>
            <h3>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
            {hasUnsavedChanges && (
              <span className={styles.unsavedIndicator}>
                🔴 Cambios sin guardar
              </span>
            )}
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Nombre de la Categoría *</label>
              <input
                type="text"
                name="categoryName"
                value={categoryForm.categoryName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ej: smartphones"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Descripción</label>
              <textarea
                name="description"
                value={categoryForm.description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Descripción de la categoría"
                rows="3"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Imagen de la Categoría * (Se redimensionará automáticamente a 300x200px)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="form-input"
            />
            <small>O ingresa una URL de imagen:</small>
            <input
              type="url"
              name="categoryImage"
              value={categoryForm.categoryImage}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://ejemplo.com/imagen.jpg"
              required
            />
            {categoryForm.categoryImage && (
              <div className={styles.imagePreview}>
                <img src={categoryForm.categoryImage} alt="Preview" />
                <small>Tamaño: 300x200px (estándar de categorías)</small>
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            <button type="submit" className="btn btn-primary">
              💾 {editingCategory ? 'Actualizar' : 'Crear'} Categoría
            </button>
            <button type="button" onClick={handleCancel} className="btn btn-hipster">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className={styles.categoriesList}>
        <div className={styles.listHeader}>
          <h3>Categorías Existentes ({localCategories.length})</h3>
          {hasChanges && (
            <div className={styles.changesAlert}>
              <span>🟢 Los cambios se han aplicado en tiempo real en la tienda</span>
              <small>Ve a "🗂️ Sistema Backup" para exportar los cambios</small>
            </div>
          )}
        </div>

        {localCategories.length === 0 ? (
          <p className={styles.emptyMessage}>No hay categorías creadas aún.</p>
        ) : (
          <div className={styles.categoriesGrid}>
            {localCategories.map(category => (
              <div key={category._id} className={`${styles.categoryCard} ${category.disabled ? styles.disabled : ''}`}>
                <div className={styles.categoryImage}>
                  <img src={category.categoryImage} alt={category.categoryName} />
                  {category.disabled && (
                    <div className={styles.disabledOverlay}>
                      <span>DESHABILITADA</span>
                    </div>
                  )}
                </div>
                <div className={styles.categoryInfo}>
                  <h4>{category.categoryName}</h4>
                  {category.description && (
                    <p>{category.description}</p>
                  )}
                  <span className={`${styles.status} ${category.disabled ? styles.statusDisabled : styles.statusActive}`}>
                    {category.disabled ? 'Deshabilitada' : 'Activa'}
                  </span>
                </div>
                <div className={styles.categoryActions}>
                  <button
                    onClick={() => editCategory(category)}
                    className="btn btn-primary"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => toggleCategoryStatus(category._id)}
                    className={`btn ${category.disabled ? 'btn-success' : 'btn-hipster'}`}
                  >
                    {category.disabled ? 'Habilitar' : 'Deshabilitar'}
                  </button>
                  <button
                    onClick={() => deleteCategory(category._id)}
                    className="btn btn-danger"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;