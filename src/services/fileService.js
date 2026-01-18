import axios from 'axios';

const API_URL = '/api';

// Dummy file data
const dummyFiles = [
  { id: 1, name: 'Project Proposal.pdf', type: 'pdf', size: '2.4 MB', modified: '2024-01-15', folder: 'Documents' },
  { id: 2, name: 'Budget Report.xlsx', type: 'spreadsheet', size: '1.8 MB', modified: '2024-01-14', folder: 'Documents' },
  { id: 3, name: 'Team Photo.jpg', type: 'image', size: '4.2 MB', modified: '2024-01-13', folder: 'Images' },
  { id: 4, name: 'Meeting Notes.txt', type: 'text', size: '24 KB', modified: '2024-01-12', folder: 'Documents' },
  { id: 5, name: 'Presentation.pptx', type: 'presentation', size: '5.6 MB', modified: '2024-01-11', folder: 'Documents' },
  { id: 6, name: 'Logo Design.png', type: 'image', size: '856 KB', modified: '2024-01-10', folder: 'Images' },
  { id: 7, name: 'Contract.pdf', type: 'pdf', size: '1.2 MB', modified: '2024-01-09', folder: 'Documents' },
  { id: 8, name: 'Vacation Photos.zip', type: 'archive', size: '45 MB', modified: '2024-01-08', folder: 'Archives' },
];

const dummyFolders = [
  { id: 101, name: 'Documents', itemCount: 12, modified: '2024-01-15' },
  { id: 102, name: 'Images', itemCount: 8, modified: '2024-01-13' },
  { id: 103, name: 'Archives', itemCount: 3, modified: '2024-01-08' },
  { id: 104, name: 'Projects', itemCount: 5, modified: '2024-01-07' },
];

const dummyTrash = [
  { id: 201, name: 'Old Report.pdf', type: 'pdf', size: '1.1 MB', deletedAt: '2024-01-14' },
  { id: 202, name: 'Unused Image.jpg', type: 'image', size: '2.3 MB', deletedAt: '2024-01-12' },
  { id: 203, name: 'Draft.txt', type: 'text', size: '15 KB', deletedAt: '2024-01-10' },
];

export const fileService = {
  getFiles: async () => {
    // Placeholder API call
    return axios.get(`${API_URL}/files`)
      .catch(() => {
        // Return dummy data for demo
        return { data: dummyFiles };
      });
  },

  getFolders: async () => {
    return axios.get(`${API_URL}/folders`)
      .catch(() => {
        return { data: dummyFolders };
      });
  },

  getTrash: async () => {
    return axios.get(`${API_URL}/trash`)
      .catch(() => {
        return { data: dummyTrash };
      });
  },

  uploadFile: async (file, onProgress) => {
    // Simulate upload with fake progress
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (onProgress) onProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          resolve({ 
            data: { 
              id: Date.now(), 
              name: file.name, 
              type: file.type.split('/')[0] || 'file',
              size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
              modified: new Date().toISOString().split('T')[0]
            } 
          });
        }
      }, 200);
    });
  },

  deleteFile: async (fileId) => {
    console.log('Moving to trash:', fileId);
    return axios.delete(`${API_URL}/files/${fileId}`)
      .catch(() => ({ data: { success: true } }));
  },

  restoreFile: async (fileId) => {
    console.log('Restoring file:', fileId);
    return axios.post(`${API_URL}/files/${fileId}/restore`)
      .catch(() => ({ data: { success: true } }));
  },

  permanentDelete: async (fileId) => {
    console.log('Permanently deleting:', fileId);
    return axios.delete(`${API_URL}/trash/${fileId}`)
      .catch(() => ({ data: { success: true } }));
  },

  shareFile: async (fileId, email, permission) => {
    console.log('Sharing file:', { fileId, email, permission });
    return axios.post(`${API_URL}/files/${fileId}/share`, { email, permission })
      .catch(() => ({
        data: {
          success: true,
          shareLink: `https://cloudnest.app/share/${fileId}-${Date.now().toString(36)}`
        }
      }));
  },

  searchFiles: (files, query) => {
    if (!query) return files;
    const lowerQuery = query.toLowerCase();
    return files.filter(file => 
      file.name.toLowerCase().includes(lowerQuery)
    );
  }
};

export default fileService;
