import React, { useState } from 'react';
import { toastHandler } from '../../../utils/utils';
import { ToastType, DEFAULT_STORE_CONFIG } from '../../../constants/constants';
import styles from './ConfigManager.module.css';

const ConfigManager = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const exportConfiguration = async () => {
    setIsExporting(true);
    
    try {
      // Simular recolección de datos de la tienda
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const storeConfig = {
        ...DEFAULT_STORE_CONFIG,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      // Crear archivo JSON
      const dataStr = JSON.stringify(storeConfig, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      // Crear enlace de descarga
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gada-electronics-config-${new Date().toISOString().split('T')[0]}.json`;
      
      // Descargar archivo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar URL
      URL.revokeObjectURL(url);
      
      toastHandler(ToastType.Success, 'Configuración exportada exitosamente');
    } catch (error) {
      toastHandler(ToastType.Error, 'Error al exportar la configuración');
    } finally {
      setIsExporting(false);
    }
  };

  const importConfiguration = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);

    try {
      const text = await file.text();
      const config = JSON.parse(text);
      
      // Validar estructura del archivo
      if (!config.storeInfo || !config.lastUpdated) {
        throw new Error('Archivo de configuración inválido');
      }

      // Simular importación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aquí aplicarías la configuración a la tienda
      console.log('Configuración importada:', config);
      
      toastHandler(ToastType.Success, 'Configuración importada exitosamente');
    } catch (error) {
      toastHandler(ToastType.Error, 'Error al importar la configuración: ' + error.message);
    } finally {
      setIsImporting(false);
      event.target.value = ''; // Limpiar input
    }
  };

  const resetToDefaults = async () => {
    if (!window.confirm('¿Estás seguro de restablecer toda la configuración a los valores por defecto? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      // Simular restablecimiento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toastHandler(ToastType.Success, 'Configuración restablecida a valores por defecto');
    } catch (error) {
      toastHandler(ToastType.Error, 'Error al restablecer la configuración');
    }
  };

  return (
    <div className={styles.configManager}>
      <h2>Gestión de Configuración</h2>
      
      <div className={styles.configSection}>
        <div className={styles.configCard}>
          <div className={styles.cardHeader}>
            <h3>📤 Exportar Configuración</h3>
          </div>
          <div className={styles.cardContent}>
            <p>
              Exporta toda la configuración de la tienda incluyendo productos, 
              cupones, zonas de entrega y configuraciones generales en un archivo JSON.
            </p>
            <button 
              onClick={exportConfiguration}
              disabled={isExporting}
              className={`btn btn-primary ${styles.actionButton}`}
            >
              {isExporting ? (
                <span className={styles.loading}>
                  <span className="loader-2"></span>
                  Exportando...
                </span>
              ) : (
                '📤 Exportar Configuración'
              )}
            </button>
          </div>
        </div>

        <div className={styles.configCard}>
          <div className={styles.cardHeader}>
            <h3>📥 Importar Configuración</h3>
          </div>
          <div className={styles.cardContent}>
            <p>
              Importa una configuración previamente exportada. Esto sobrescribirá 
              toda la configuración actual de la tienda.
            </p>
            <div className={styles.importContainer}>
              <input
                type="file"
                accept=".json"
                onChange={importConfiguration}
                disabled={isImporting}
                className={styles.fileInput}
                id="config-import"
              />
              <label 
                htmlFor="config-import" 
                className={`btn btn-success ${styles.actionButton} ${isImporting ? styles.disabled : ''}`}
              >
                {isImporting ? (
                  <span className={styles.loading}>
                    <span className="loader-2"></span>
                    Importando...
                  </span>
                ) : (
                  '📥 Seleccionar Archivo'
                )}
              </label>
            </div>
          </div>
        </div>

        <div className={styles.configCard}>
          <div className={styles.cardHeader}>
            <h3>🔄 Restablecer Configuración</h3>
          </div>
          <div className={styles.cardContent}>
            <p>
              Restablece toda la configuración de la tienda a los valores por defecto. 
              <strong> Esta acción no se puede deshacer.</strong>
            </p>
            <button 
              onClick={resetToDefaults}
              className={`btn btn-danger ${styles.actionButton}`}
            >
              🔄 Restablecer a Valores por Defecto
            </button>
          </div>
        </div>
      </div>

      <div className={styles.infoSection}>
        <h3>ℹ️ Información Importante</h3>
        <div className={styles.infoList}>
          <div className={styles.infoItem}>
            <strong>Formato del archivo:</strong> JSON (.json)
          </div>
          <div className={styles.infoItem}>
            <strong>Contenido incluido:</strong> Productos, cupones, zonas de entrega, configuración general
          </div>
          <div className={styles.infoItem}>
            <strong>Compatibilidad:</strong> Solo archivos exportados desde esta versión del panel
          </div>
          <div className={styles.infoItem}>
            <strong>Seguridad:</strong> Realiza copias de seguridad antes de importar configuraciones
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigManager;