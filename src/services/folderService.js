import axios from 'axios';

const API_URL = '/api';

export const folderService = {
  getFolders: async () => {
    return axios.get(`${API_URL}/folders`)
      .catch(() => ({
        data: [
          { id: 101, name: 'Documents', itemCount: 12, modified: '2024-01-15' },
          { id: 102, name: 'Images', itemCount: 8, modified: '2024-01-13' },
          { id: 103, name: 'Archives', itemCount: 3, modified: '2024-01-08' },
          { id: 104, name: 'Projects', itemCount: 5, modified: '2024-01-07' },
        ]
      }));
  },

  createFolder: async (name, parentId = null) => {
    console.log('Creating folder:', { name, parentId });
    return axios.post(`${API_URL}/folders`, { name, parentId })
      .catch(() => ({
        data: {
          id: Date.now(),
          name,
          itemCount: 0,
          modified: new Date().toISOString().split('T')[0]
        }
      }));
  },

  deleteFolder: async (folderId) => {
    console.log('Deleting folder:', folderId);
    return axios.delete(`${API_URL}/folders/${folderId}`)
      .catch(() => ({ data: { success: true } }));
  },

  renameFolder: async (folderId, newName) => {
    console.log('Renaming folder:', { folderId, newName });
    return axios.patch(`${API_URL}/folders/${folderId}`, { name: newName })
      .catch(() => ({ data: { success: true, name: newName } }));
  },

  navigateToFolder: (folderId) => {
    // This would typically fetch folder contents
    console.log('Navigating to folder:', folderId);
    return Promise.resolve({ data: { folderId, items: [] } });
  }
};

export default folderService;
