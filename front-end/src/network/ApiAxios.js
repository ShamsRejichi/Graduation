import axios from 'axios';
import config from "../config";

// const https = require('https');
//
// const agent = new https.Agent({
//     rejectUnauthorized: false,
// });

const instance = axios.create({
    baseURL: config.WS_BASE_URL,
});

instance.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    config.headers.Authorization = (token ? token : '');
    config.headers.ContentType = 'application/json';
    return config;
});

export const getAll = async () => (
    await instance.post('users/all')
);

export const register = async (name, email, password, phone, agency, role) => (
    await instance.post('users/register', {name, email, password, phone, agency, role})
);

export const confirmRegister = async id => (
    await instance.post(`users/confirm/${id}`)
);
export const sendEvaluationEmail = async (id) => {
  await instance.post(`users/send-evaluation-email/${id}`);
};
export const submitEvaluation = async (id,formDataWithId) => {
  await instance.post(`users/submit-evaluation/${id}`, formDataWithId);
};

export const updateEvaluation = async (evaluationId, answerIndex, answer) => {
  await instance.put(`users/evaluations/${evaluationId}`, { answerIndex, answer });
}



export const addScoreAndSendEmail = async (id, score, evaluationId) => {
  await instance.post(`users/add-score-and-send-email/${id}`, { score, evaluationId });
}





export const forgotPassword = async email => (
    await instance.post('users/forgotpassword', {email})
);

export const confirmReset = async (id, password) => (
    await instance.post(`users/resetpass/${id}`, {password})
);

export const login = async (email, password) => (
    await instance.post('users/login', {email, password})
);

export const savePicture = async (id, formData) => (
    await instance.post(`/users/${id}/profile-picture`, formData)
  );
  
  
  
export const logout = async token => (
    await instance.post('users/logout', {token})
);

export const edit = async (userID, name, email, address, city, country, postalcode, selectedSkills) => (
    await instance.post('/users/edit', {userID, name, email, address, city, country, postalcode, selectedSkills})
);
export const updateUser = async (userID, { role, pole }) => {
    const updatedUser = { role: role, pole: pole};
    await instance.put(`/users/${userID}`, updatedUser);
  };
  export const updateProjet = async (id, { selectedstatus, progress }) => {
    const updatedProjets = { selectedstatus: selectedstatus, progress: progress };
    await instance.put(`/users/api/projets/${id}`, updatedProjets);
  };
  export const updateProject = async (id, { users, percentage }) => {
    await instance.put(`/users/api/projects/${id}`, {users, percentage});
    
  };
  
  
  
export const addSkill = async (label,level) => (
    await instance.post('/users/api/skills', { label, level })
);



export const getSkills = async () => (
    await instance.get('/users/api/skills')
);
export const getEvaluations = async () => (
  await instance.get(`/users/api/evaluations/`)
);

  
export const deleteSkill = async (id) => { 
     await instance.delete(`/users/api/skills/${id}`);
     
  };


  export const addProjet = async (label, description, clientName,Date, projectDirector ,manager, selectedstatus,progress) => (
    await instance.post('/users/api/projets', { label, description, clientName,Date, projectDirector, manager, selectedstatus,progress })
);


export const getProjets = async () => (
    await instance.get('/users/api/projets')
);


export const updateOrg = async (id, orgData) => {
  try {
    const response = await instance.put(`users/orgs/${id}`, orgData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update organization');
  }
  
};

  
export const deleteProjet = async (id) => { 
     await instance.delete(`/users/api/projets/${id}`);
     
  };
  export const deleteTeam = async (id) => {
    await instance.delete(`users/orgs/${id}`);
  };
  

  export const createOrg = async (name, manager, date, description, selectedOptions) => {
    return await instance.post('/users/teams', {
      name,
      manager,
      date,
      description,
      selectedOptions
    });
  };

  
  
  export const getUsers = async () => {
    return await instance.get('/users/get');
  };

  
  export const getManagers = async () => {
    return await instance.get('/users/getManagers');
  };
  export const getProjectDirectors = async () => {
    return await instance.get('/users/getProjectDirectors');
  };


  export const getTeams = async () => (
    await instance.get('/users/api/teams')
);

  