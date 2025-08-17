import api from '../utils/api';

const affectationService = {
  // ===== AFFECTATIONS =====
  async getAllAffectations() {
    try {
      console.log('🔄 AffectationService: Récupération de toutes les affectations...');
      const response = await api.get('/api/affectations');
      console.log('✅ AffectationService: Affectations récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la récupération des affectations:', error);
      throw error;
    }
  },

  async createAffectation(affectationData) {
    try {
      // Validation des données requises - accepter les deux formats (camelCase et lowercase)
      const hasRequiredFields = affectationData.idSalle && 
        (affectationData.typeActivite || affectationData.typeactivite) && 
        affectationData.date && 
        (affectationData.heureDebut || affectationData.heuredebut) && 
        (affectationData.heureFin || affectationData.heurefin);
        
      if (!hasRequiredFields) {
        const missingFields = [];
        if (!affectationData.idSalle) missingFields.push('idSalle');
        if (!affectationData.typeActivite && !affectationData.typeactivite) missingFields.push('typeActivite/typeactivite');
        if (!affectationData.date) missingFields.push('date');
        if (!affectationData.heureDebut && !affectationData.heuredebut) missingFields.push('heureDebut/heuredebut');
        if (!affectationData.heureFin && !affectationData.heurefin) missingFields.push('heureFin/heurefin');
        
        console.error('❌ AffectationService: Champs manquants:', missingFields);
        console.error('❌ AffectationService: Données reçues:', affectationData);
        throw new Error(`Champs manquants: ${missingFields.join(', ')}`);
      }
      
      // Normaliser les données pour utiliser le format camelCase (comme les recommandations IA)
      const normalizedData = {
        idSalle: affectationData.idSalle,
        typeActivite: affectationData.typeActivite || affectationData.typeactivite,
        date: affectationData.date,
        heureDebut: affectationData.heureDebut || affectationData.heuredebut,
        heureFin: affectationData.heureFin || affectationData.heurefin
      };
      
      const response = await api.post('/api/affectations', normalizedData);
      
      // Vérifier si la réponse contient une affectation créée
      if (response.data && response.data.affectation) {
        return response.data.affectation;
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la création de l\'affectation:', error);

      
      if (error.response?.status === 400) {
        console.error('🔍 AffectationService: Erreur 400 - Payload envoyé:', affectationData);
        console.error('🔍 AffectationService: Réponse du serveur:', error.response.data);
      }
      
      throw error;
    }
  },

  async updateAffectation(id, affectationData) {
    try {

      const response = await api.put(`/api/affectations/${id}`, affectationData);

      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la mise à jour de l\'affectation:', error);
      throw error;
    }
  },

  async deleteAffectation(id) {
    try {

      const response = await api.delete(`/api/affectations/${id}`);

      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la suppression de l\'affectation:', error);
      throw error;
    }
  },

  // ===== APPROVAL WORKFLOW =====
  async getPendingAffectations() {
    try {
      console.log('🔄 AffectationService: Récupération des affectations en attente...');
      const response = await api.get('/api/affectations/pending');
      console.log('✅ AffectationService: Affectations en attente récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la récupération des affectations en attente:', error);
      throw error;
    }
  },

  async getMyPendingAffectations() {
    try {
      console.log('🔄 AffectationService: Récupération de mes affectations en attente...');
      const response = await api.get('/api/affectations/my-pending');
      console.log('✅ AffectationService: Mes affectations en attente récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la récupération de mes affectations en attente:', error);
      throw error;
    }
  },

  async approveAffectation(id, approvalData = {}) {
    try {
      console.log('🔄 AffectationService: Approbation de l\'affectation:', id);
      try {
        const response = await api.post(`/api/affectations/${id}/approve`, {
          approved: true,
          approverId: approvalData.approverId,
          approvalTime: new Date().toISOString(),
          ...approvalData
        });
        console.log('✅ AffectationService: Affectation approuvée via endpoint approve:', response.data);
        return response.data;
      } catch (approvalError) {
        console.log('⚠️ Endpoint approve non disponible, tentative avec update...');
        const response = await api.put(`/api/affectations/${id}`, {
          status: 'approved',
          approverId: approvalData.approverId,
          approvalTime: new Date().toISOString(),
          ...approvalData
        });
        console.log('✅ AffectationService: Affectation approuvée via update:', response.data);
        return response.data;
      }
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de l\'approbation:', error);
      throw error;
    }
  },

  async rejectAffectation(id, rejectionData = {}) {
    try {
      console.log('🔄 AffectationService: Rejet de l\'affectation:', id);
      try {
        const response = await api.post(`/api/affectations/${id}/approve`, {
          approved: false,
          approverId: rejectionData.approverId,
          approvalTime: new Date().toISOString(),
          rejectionReason: rejectionData.rejectionReason,
          ...rejectionData
        });
        console.log('✅ AffectationService: Affectation rejetée via endpoint approve:', response.data);
        return response.data;
      } catch (approvalError) {
        console.log('⚠️ Endpoint approve non disponible, tentative avec update...');
        const response = await api.put(`/api/affectations/${id}`, {
          status: 'rejected',
          approverId: rejectionData.approverId,
          approvalTime: new Date().toISOString(),
          rejectionReason: rejectionData.rejectionReason,
          ...rejectionData
        });
        console.log('✅ AffectationService: Affectation rejetée via update:', response.data);
      return response.data;
      }
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors du rejet:', error);
      throw error;
    }
  },

  // ===== SALLES (ANCIENNES) =====
  async getSalles() {
    try {
      console.log('🔄 AffectationService: Récupération des salles...');
      const response = await api.get('/api/salles');
      console.log('✅ AffectationService: Salles récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la récupération des salles:', error);
      throw error;
    }
  },

  async getSallesWithDetails() {
    try {
      const response = await api.get('/api/salles');
      
      // Vérifier que les salles ont bien les informations hiérarchiques
      const sallesWithDetails = response.data.map(salle => {
        if (!salle.blocNom || !salle.etageNumero) {
          console.warn('⚠️ Salle sans informations hiérarchiques complètes:', salle);
        }
        return salle;
      });
      
      return sallesWithDetails;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la récupération des salles avec détails:', error);
      
      // Mode développement: données de test si l'endpoint n'est pas disponible
      if (error.response?.status === 404 || error.response?.status === 500 || error.code === 'ERR_BAD_RESPONSE') {
        console.log('🔄 Mode développement: Utilisation de données de test pour les salles');
        
        const mockSalles = [
          {
            idSalle: 1,
            nomSalle: 'Salle 101',
            typeSalle: 'Amphithéâtre',
            capacite: 120,
            blocNom: 'Bloc A',
            etageNumero: '1er étage',
            etageId: 1,
            blocId: 1
          },
          {
            idSalle: 2,
            nomSalle: 'Salle 102',
            typeSalle: 'Salle de cours',
            capacite: 30,
            blocNom: 'Bloc A',
            etageNumero: '1er étage',
            etageId: 1,
            blocId: 1
          },
          {
            idSalle: 3,
            nomSalle: 'Salle 201',
            typeSalle: 'Laboratoire',
            capacite: 25,
            blocNom: 'Bloc A',
            etageNumero: '2ème étage',
            etageId: 2,
            blocId: 1
          },
          {
            idSalle: 4,
            nomSalle: 'Salle RDC-01',
            typeSalle: 'Salle de réunion',
            capacite: 15,
            blocNom: 'Bloc B',
            etageNumero: 'Rez-de-chaussée',
            etageId: 3,
            blocId: 2
          },
          {
            idSalle: 5,
            nomSalle: 'Salle 101-B',
            typeSalle: 'Salle informatique',
            capacite: 20,
            blocNom: 'Bloc B',
            etageNumero: '1er étage',
            etageId: 4,
            blocId: 2
          }
        ];
        return mockSalles;
      }
      
      throw error;
    }
  },

  // ===== NOUVELLES FONCTIONNALITÉS HIÉRARCHIQUES =====
  
  // ===== GESTION DES BLOCS =====
    async testAllEndpoints() {
    try {
      console.log('🧪 AffectationService: Test complet de tous les endpoints...');
      
      // Test de connectivité générale
      try {
        const healthResponse = await api.get('/api/health');
        console.log('✅ Connectivité backend OK:', healthResponse.status);
      } catch (error) {
        console.log('⚠️ Endpoint /api/health non disponible, test de connectivité de base...');
        try {
          const baseResponse = await api.get('/');
          console.log('✅ Connectivité de base OK:', baseResponse.status);
        } catch (baseError) {
          console.log('❌ Problème de connectivité:', baseError.message);
        }
      }
      
      // Test GET /api/blocs
      try {
        const response = await api.get('/api/blocs');
        console.log('✅ GET /api/blocs fonctionne:', response.status, response.data?.length || 0, 'blocs trouvés');
      } catch (error) {
        console.log('❌ GET /api/blocs échoue:', error.response?.status, error.response?.statusText);
        if (error.response?.status === 404) {
          console.log('💡 Endpoint /api/blocs non implémenté côté backend');
        }
      }
      
      // Test GET /api/salles
      try {
        const sallesResponse = await api.get('/api/salles');
        console.log('✅ GET /api/salles fonctionne:', sallesResponse.status, sallesResponse.data?.length || 0, 'salles trouvées');
        if (sallesResponse.data?.length > 0) {
          console.log('📋 Exemple de salle:', sallesResponse.data[0]);
        }
      } catch (error) {
        console.log('❌ GET /api/salles échoue:', error.response?.status, error.response?.statusText);
        if (error.response?.status === 404) {
          console.log('💡 Endpoint /api/salles non implémenté côté backend');
        } else if (error.response?.status === 500) {
          console.log('💡 Endpoint /api/salles retourne une erreur 500 - problème backend');
        }
      }
      
      // Test POST /api/blocs
      try {
        const testBlocData = { nom: 'Test Bloc ' + Date.now() };
        const response = await api.post('/api/blocs', testBlocData);
        console.log('✅ POST /api/blocs fonctionne:', response.status, 'Bloc créé:', response.data);
        
        // Test GET /api/etages
        try {
          const etagesResponse = await api.get('/api/etages');
          console.log('✅ GET /api/etages fonctionne:', etagesResponse.status, etagesResponse.data?.length || 0, 'étages trouvés');
        } catch (error) {
          console.log('❌ GET /api/etages échoue:', error.response?.status, error.response?.statusText);
          if (error.response?.status === 404) {
            console.log('💡 Endpoint /api/etages non implémenté côté backend');
          }
        }
        
        // Test POST /api/etages
        try {
          const testEtageData = { 
            numero: 'Test Étage ' + Date.now(),
            blocId: response.data.id || 1
          };
          const etageResponse = await api.post('/api/etages', testEtageData);
          console.log('✅ POST /api/etages fonctionne:', etageResponse.status, 'Étage créé:', etageResponse.data);
          
          // Test GET /api/etages/bloc/{blocId}
          try {
            const blocId = response.data.id || 1;
            const etagesByBlocResponse = await api.get(`/api/etages/bloc/${blocId}`);
            console.log('✅ GET /api/etages/bloc/{blocId} fonctionne:', etagesByBlocResponse.status, etagesByBlocResponse.data?.length || 0, 'étages trouvés pour ce bloc');
          } catch (error) {
            console.log('❌ GET /api/etages/bloc/{blocId} échoue:', error.response?.status, error.response?.statusText);
            if (error.response?.status === 404) {
              console.log('💡 Endpoint /api/etages/bloc/{blocId} non implémenté côté backend');
            }
          }
          
        } catch (error) {
          console.log('❌ POST /api/etages échoue:', error.response?.status, error.response?.statusText);
          if (error.response?.status === 404) {
            console.log('💡 Endpoint /api/etages non implémenté côté backend');
          }
        }
        
      } catch (error) {
        console.log('❌ POST /api/blocs échoue:', error.response?.status, error.response?.statusText);
        if (error.response?.status === 404) {
          console.log('💡 Endpoint /api/blocs non implémenté côté backend');
        }
      }
      
      console.log('🎯 Résumé: Si vous voyez des erreurs 404, les endpoints ne sont pas encore implémentés côté backend.');
      console.log('💡 Le frontend utilise actuellement des données de test pour le développement.');
      console.log('⚠️ IMPORTANT: Si GET /api/salles échoue, les salles créées ne seront pas visibles après refresh!');
      
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors du test des endpoints:', error);
    }
  },

  async testBlocEndpoints() {
    try {
      console.log('🧪 AffectationService: Test des endpoints blocs...');
      
      // Test GET /api/blocs
      try {
        const response = await api.get('/api/blocs');
        console.log('✅ GET /api/blocs fonctionne:', response.status);
      } catch (error) {
        console.log('❌ GET /api/blocs échoue:', error.response?.status, error.response?.statusText);
      }
      
      // Test POST /api/blocs
      try {
        const testData = { nom: 'Test Bloc' };
        const response = await api.post('/api/blocs', testData);
        console.log('✅ POST /api/blocs fonctionne:', response.status);
      } catch (error) {
        console.log('❌ POST /api/blocs échoue:', error.response?.status, error.response?.statusText);
      }
      
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors du test des endpoints:', error);
    }
  },

  async testSalleEndpoints() {
    try {
      console.log('🧪 AffectationService: Test des endpoints salles...');
      
      // Test GET /api/salles
      try {
        const response = await api.get('/api/salles');
        console.log('✅ GET /api/salles fonctionne:', response.status, response.data?.length || 0, 'salles trouvées');
        if (response.data?.length > 0) {
          console.log('📋 Première salle:', response.data[0]);
          console.log('🔍 Vérification des informations hiérarchiques:');
          console.log('   - blocNom:', response.data[0].blocNom);
          console.log('   - etageNumero:', response.data[0].etageNumero);
          console.log('   - blocId:', response.data[0].blocId);
          console.log('   - etageId:', response.data[0].etageId);
        }
      } catch (error) {
        console.log('❌ GET /api/salles échoue:', error.response?.status, error.response?.statusText);
        console.log('📊 Détails de l\'erreur:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      
      // Test POST /api/salles (si vous voulez tester la création)
      try {
        const testSalleData = { 
          nom: 'Test Salle ' + Date.now(),
          capacite: 30,
          type: 'Salle de test',
          etageId: 1  // Assurez-vous que cet étage existe
        };
        const response = await api.post('/api/salles', testSalleData);
        console.log('✅ POST /api/salles fonctionne:', response.status, 'Salle créée:', response.data);
      } catch (error) {
        console.log('❌ POST /api/salles échoue:', error.response?.status, error.response?.statusText);
        console.log('📊 Détails de l\'erreur:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors du test des endpoints salles:', error);
    }
  },

  async testSallesEndpointOnly() {
    try {
      console.log('🧪 AffectationService: Test spécifique de GET /api/salles...');
      
      const response = await api.get('/api/salles');
      console.log('✅ GET /api/salles SUCCÈS:', {
        status: response.status,
        statusText: response.statusText,
        sallesCount: response.data?.length || 0,
        headers: response.headers,
        config: response.config
      });
      
      if (response.data?.length > 0) {
        console.log('📋 Exemples de salles:');
        response.data.slice(0, 3).forEach((salle, index) => {
          console.log(`  ${index + 1}. Salle:`, {
            id: salle.id || salle.idSalle,
            nom: salle.nom || salle.nomSalle,
            type: salle.type || salle.typeSalle,
            capacite: salle.capacite,
            etageId: salle.etageId,
            blocId: salle.blocId,
            blocNom: salle.blocNom,
            etageNumero: salle.etageNumero
          });
        });
      } else {
        console.log('⚠️ Aucune salle trouvée dans la réponse');
      }
      
      return response.data;
      
    } catch (error) {
      console.error('❌ GET /api/salles ÉCHEC:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        code: error.code,
        config: error.config
      });
      
      // Essayer de diagnostiquer le problème
      if (error.response?.status === 404) {
        console.log('💡 Endpoint /api/salles non trouvé (404) - Vérifiez la route backend');
      } else if (error.response?.status === 500) {
        console.log('💡 Erreur serveur (500) - Problème côté backend');
      } else if (error.code === 'ERR_BAD_RESPONSE') {
        console.log('💡 Erreur de réponse - Vérifiez que le backend est démarré');
      } else if (error.message?.includes('Network Error')) {
        console.log('💡 Erreur réseau - Vérifiez la connectivité');
      }
      
      throw error;
    }
  },

  async getSallesWithCompleteHierarchy() {
    try {
      console.log('🔄 AffectationService: Récupération des salles avec hiérarchie complète...');
      
      // Récupérer toutes les données
      const [sallesResponse, blocsResponse, etagesResponse] = await Promise.all([
        api.get('/api/salles'),
        api.get('/api/blocs'),
        api.get('/api/etages')
      ]);
      
      const salles = sallesResponse.data;
      const blocs = blocsResponse.data;
      const etages = etagesResponse.data;
      
      console.log('📊 Données récupérées:', {
        salles: salles.length,
        blocs: blocs.length,
        etages: etages.length
      });
      
      // Enrichir les salles avec les informations hiérarchiques
      const sallesWithHierarchy = salles.map(salle => {
        const etage = etages.find(e => e.id === salle.etageId);
        const bloc = blocs.find(b => b.id === (etage?.blocId || salle.blocId));
        
        return {
          ...salle,
          blocNom: bloc?.nom || 'Bloc inconnu',
          etageNumero: etage?.numero || 'Étage inconnu',
          blocId: bloc?.id || salle.blocId,
          etageId: etage?.id || salle.etageId
        };
      });
      
      console.log('✅ Salles avec hiérarchie complète:', sallesWithHierarchy);
      return sallesWithHierarchy;
      
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la récupération de la hiérarchie complète:', error);
      console.error('📊 Détails de l\'erreur hiérarchie:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        code: error.code
      });
      
      // Fallback: essayer de récupérer juste les salles
      try {
        console.log('🔄 Fallback: Récupération des salles de base...');
        const response = await api.get('/api/salles');
        console.log('✅ Fallback réussi, salles récupérées:', response.data.length);
        return response.data;
      } catch (fallbackError) {
        console.error('❌ Fallback échoué aussi:', fallbackError);
        console.error('📊 Détails de l\'erreur fallback:', {
          status: fallbackError.response?.status,
          statusText: fallbackError.response?.statusText,
          data: fallbackError.response?.data,
          message: fallbackError.message,
          code: fallbackError.code
        });
        
        // Fallback final: utiliser les données de test
        console.log('🔄 Fallback final: Utilisation des données de test pour les salles');
        console.log('⚠️ ATTENTION: Les salles créées en base ne seront pas visibles');
        
        const mockSalles = [
          {
            idSalle: 1,
            nomSalle: 'Salle 101',
            typeSalle: 'Amphithéâtre',
            capacite: 120,
            blocNom: 'Bloc A',
            etageNumero: '1er étage',
            etageId: 1,
            blocId: 1
          },
          {
            idSalle: 2,
            nomSalle: 'Salle 102',
            typeSalle: 'Salle de cours',
            capacite: 30,
            blocNom: 'Bloc A',
            etageNumero: '1er étage',
            etageId: 1,
            blocId: 1
          },
          {
            idSalle: 3,
            nomSalle: 'Salle 201',
            typeSalle: 'Laboratoire',
            capacite: 25,
            blocNom: 'Bloc A',
            etageNumero: '2ème étage',
            etageId: 2,
            blocId: 1
          }
        ];
        
        return mockSalles;
      }
    }
  },

  async getAllBlocs() {
    try {
      console.log('🔄 AffectationService: Récupération de tous les blocs...');
      const response = await api.get('/api/blocs');
      console.log('✅ AffectationService: Blocs récupérés:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la récupération des blocs:', error);
      
      // Mode développement: données de test si l'endpoint n'est pas disponible
      if (error.response?.status === 404 || error.response?.status === 500) {
        console.log('🔄 Mode développement: Utilisation de données de test pour les blocs');
        const mockBlocs = [
          { id: 1, nom: 'Bloc A', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 2, nom: 'Bloc B', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 3, nom: 'Bloc C', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        ];
        return mockBlocs;
      }
      
      throw error;
    }
  },

  async getBlocById(id) {
    try {
      console.log('🔄 AffectationService: Récupération du bloc:', id);
      const response = await api.get(`/api/blocs/${id}`);
      console.log('✅ AffectationService: Bloc récupéré:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la récupération du bloc:', error);
      throw error;
    }
  },

  async createBloc(blocData) {
    try {
      console.log('🔄 AffectationService: Création d\'un nouveau bloc:', blocData);
      console.log('📡 URL:', '/api/blocs');
      console.log('📦 Data envoyée:', JSON.stringify(blocData, null, 2));
      
      const response = await api.post('/api/blocs', blocData);
      console.log('✅ AffectationService: Bloc créé:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la création du bloc:', error);
      console.error('📊 Détails de l\'erreur:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      // Ne jamais simuler un succès pour une opération d'écriture (création)
      // Laisser l'erreur remonter pour que l'UI affiche l'échec correctement
      throw error;
    }
  },

  async updateBloc(id, blocData) {
    try {
      console.log('🔄 AffectationService: Mise à jour du bloc:', id, blocData);
      console.log('📡 URL:', `/api/blocs/${id}`);
      console.log('📦 Data envoyée:', JSON.stringify(blocData, null, 2));
      
      const response = await api.put(`/api/blocs/${id}`, blocData);
      console.log('✅ AffectationService: Bloc mis à jour:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la mise à jour du bloc:', error);
      console.error('📊 Détails de l\'erreur:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      throw error;
    }
  },

  async deleteBloc(id) {
    try {
      console.log('🔄 AffectationService: Suppression du bloc:', id);
      const response = await api.delete(`/api/blocs/${id}`);
      console.log('✅ AffectationService: Bloc supprimé');
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la suppression du bloc:', error);
      throw error;
    }
  },

  // ===== GESTION DES ÉTAGES =====
  async getAllEtages() {
    try {
      console.log('🔄 AffectationService: Récupération de tous les étages...');
      const response = await api.get('/api/etages');
      console.log('✅ AffectationService: Étages récupérés:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la récupération des étages:', error);
      console.error('📊 Détails de l\'erreur étages:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // Mode développement: données de test si l'endpoint n'est pas disponible ou en erreur
      if (error.response?.status === 404 || error.response?.status === 500 || error.response?.status === undefined || error.code === 'ERR_BAD_RESPONSE') {
        console.log('🔄 Mode développement: Utilisation de données de test pour les étages (erreur 500 détectée)');
        const mockEtages = [
          { id: 1, numero: '1er étage', blocId: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 2, numero: '2ème étage', blocId: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 3, numero: 'Rez-de-chaussée', blocId: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 4, numero: '1er étage', blocId: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        ];
        console.log('✅ Mock étages récupérés:', mockEtages);
        return mockEtages;
      }
      
      throw error;
    }
  },

  async getEtagesByBlocId(blocId) {
    try {
      console.log('🔄 AffectationService: Récupération des étages du bloc:', blocId);
      const response = await api.get(`/api/etages/bloc/${blocId}`);
      console.log('✅ AffectationService: Étages du bloc récupérés:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la récupération des étages du bloc:', error);
      
      // Mode développement: filtrer les étages de test par blocId
      if (error.response?.status === 404 || error.response?.status === 500 || error.code === 'ERR_BAD_RESPONSE') {
        console.log('🔄 Mode développement: Filtrage des étages de test pour le bloc:', blocId);
        const mockEtages = [
          { id: 1, numero: '1er étage', blocId: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 2, numero: '2ème étage', blocId: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 3, numero: 'Rez-de-chaussée', blocId: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 4, numero: '1er étage', blocId: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        ];
        const filteredEtages = mockEtages.filter(etage => etage.blocId === blocId);
        console.log('✅ Mock étages filtrés:', filteredEtages);
        return filteredEtages;
      }
      
      throw error;
    }
  },

  async getEtagesByBlocNom(blocNom) {
    try {
      console.log('🔄 AffectationService: Récupération des étages du bloc:', blocNom);
      const response = await api.get(`/api/etages/bloc-nom/${blocNom}`);
      console.log('✅ AffectationService: Étages du bloc récupérés:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la récupération des étages du bloc:', error);
      throw error;
    }
  },

  async createEtage(etageData) {
    try {
      console.log('🔄 AffectationService: Création d\'un nouvel étage:', etageData);
      const response = await api.post('/api/etages', etageData);
      console.log('✅ AffectationService: Étage créé:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la création de l\'étage:', error);
      // Ne jamais simuler un succès pour une opération d'écriture (création)
      // Laisser l'erreur remonter pour que l'UI affiche l'échec correctement
      throw error;
    }
  },

  async updateEtage(id, etageData) {
    try {
      console.log('🔄 AffectationService: Mise à jour de l\'étage:', id, etageData);
      const response = await api.put(`/api/etages/${id}`, etageData);
      console.log('✅ AffectationService: Étage mis à jour:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la mise à jour de l\'étage:', error);
      throw error;
    }
  },

  async deleteEtage(id) {
    try {
      console.log('🔄 AffectationService: Suppression de l\'étage:', id);
      const response = await api.delete(`/api/etages/${id}`);
      console.log('✅ AffectationService: Étage supprimé');
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la suppression de l\'étage:', error);
      throw error;
    }
  },

  // ===== GESTION DES SALLES (MISE À JOUR) =====
  async getSallesByBlocId(blocId) {
    try {
      console.log('🔄 AffectationService: Récupération des salles du bloc:', blocId);
      const response = await api.get(`/api/salles/bloc/${blocId}`);
      console.log('✅ AffectationService: Salles du bloc récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la récupération des salles du bloc:', error);
      throw error;
    }
  },

  async getSallesByBlocNom(blocNom) {
    try {
      console.log('🔄 AffectationService: Récupération des salles du bloc:', blocNom);
      const response = await api.get(`/api/salles/bloc-nom/${blocNom}`);
      console.log('✅ AffectationService: Salles du bloc récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la récupération des salles du bloc:', error);
      throw error;
    }
  },

  async getSallesByEtageId(etageId) {
    try {
      console.log('🔄 AffectationService: Récupération des salles de l\'étage:', etageId);
      const response = await api.get(`/api/salles/etage/${etageId}`);
      console.log('✅ AffectationService: Salles de l\'étage récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la récupération des salles de l\'étage:', error);
      throw error;
    }
  },

  async getSallesByBlocAndEtage(blocNom, etageNumero) {
    try {
      console.log('🔄 AffectationService: Récupération des salles du bloc et étage:', blocNom, etageNumero);
      const response = await api.get(`/api/salles/bloc/${blocNom}/etage/${etageNumero}`);
      console.log('✅ AffectationService: Salles du bloc et étage récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la récupération des salles du bloc et étage:', error);
      throw error;
    }
  },

  async createSalle(salleData) {
    try {
      console.log('🔄 AffectationService: Création d\'une nouvelle salle:', salleData);
      const response = await api.post('/api/salles', salleData);
      console.log('✅ AffectationService: Salle créée:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la création de la salle:', error);
      throw error;
    }
  },

  async updateSalle(id, salleData) {
    try {
      console.log('🔄 AffectationService: Mise à jour de la salle:', id, salleData);
      const response = await api.put(`/api/salles/${id}`, salleData);
      console.log('✅ AffectationService: Salle mise à jour:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la mise à jour de la salle:', error);
      throw error;
    }
  },

  async deleteSalle(id) {
    try {
      console.log('🔄 AffectationService: Suppression de la salle:', id);
      const response = await api.delete(`/api/salles/${id}`);
      console.log('✅ AffectationService: Salle supprimée');
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la suppression de la salle:', error);
      throw error;
    }
  },

  // ===== SMART RECOMMENDATIONS =====
  async getSmartRoomRecommendations(requestData) {
    try {
      console.log('🤖 AffectationService: Demande de recommandations INTELLIGENTES...');
      console.log('📊 Données envoyées:', requestData);
      
      const response = await api.post('/api/smart-recommendations/rooms', requestData);
      console.log('✅ AffectationService: Recommandations INTELLIGENTES reçues:', response.data);
      
      // Log intelligent features
      if (response.data.aiReasoning) {
        console.log('🧠 Raisonnement IA:', response.data.aiReasoning);
      }
      if (response.data.optimalStrategy) {
        console.log('🎯 Stratégie optimale:', response.data.optimalStrategy);
      }
      if (response.data.hasConflicts) {
        console.log('⚠️ Conflits détectés:', response.data.conflictResolution);
      }
      if (response.data.alternativeTimeSlots) {
        console.log('🕐 Créneaux alternatifs:', response.data.alternativeTimeSlots);
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la récupération des recommandations INTELLIGENTES:', error);
      throw error;
    }
  },

  async getConflictResolution(conflictData) {
    try {
      console.log('🤖 AffectationService: Résolution de conflit demandée...');
      const response = await api.post('/api/smart-recommendations/conflict-resolution', conflictData);
      console.log('✅ AffectationService: Résolution de conflit reçue:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la résolution de conflit:', error);
      throw error;
    }
  },

  async getFormSuggestions(userInput) {
    try {
      console.log('🤖 AffectationService: Suggestions de formulaire demandées...');
      const response = await api.post('/api/smart-recommendations/form-suggestions', userInput);
      console.log('✅ AffectationService: Suggestions reçues:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Erreur lors de la récupération des suggestions:', error);
      throw error;
    }
  },

  async checkSmartRecommendationsHealth() {
    try {
      const response = await api.get('/api/smart-recommendations/health');
      return response.data;
    } catch (error) {
      console.error('❌ AffectationService: Service de recommandations indisponible:', error);
      return { status: 'unavailable', error: error.message };
    }
  }
};

export default affectationService; 