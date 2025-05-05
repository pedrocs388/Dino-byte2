// auth.js - Todas as funções de autenticação

// Função para registrar um novo usuário
function registerUser(userData) {
    const users = JSON.parse(localStorage.getItem('dinoByteUsers')) || [];
    
    // Verifica se o usuário já existe
    if (users.some(u => u.username === userData.username)) {
        return { success: false, message: 'Nome de usuário já em uso' };
    }
    
    // Verifica se o CPF já existe
    if (users.some(u => u.cpf === userData.cpf)) {
        return { success: false, message: 'CPF já cadastrado' };
    }
    
    // Adiciona data de cadastro
    userData.joinDate = new Date().toISOString();
    userData.purchases = [];
    userData.sales = [];
    
    users.push(userData);
    localStorage.setItem('dinoByteUsers', JSON.stringify(users));
    
    return { success: true };
}

// Função para fazer login
function loginUser(username, password) {
    const users = JSON.parse(localStorage.getItem('dinoByteUsers')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('dinoByteLoggedUser', JSON.stringify(user));
        return true;
    }
    return false;
}

// Função para fazer logout
function logoutUser() {
    localStorage.removeItem('dinoByteLoggedUser');
}

// Função para obter o usuário logado
function getLoggedUser() {
    return JSON.parse(localStorage.getItem('dinoByteLoggedUser'));
}

// Função para atualizar usuário
function updateUser(updatedUser) {
    const users = JSON.parse(localStorage.getItem('dinoByteUsers')) || [];
    const index = users.findIndex(u => u.username === updatedUser.username);
    
    if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('dinoByteUsers', JSON.stringify(users));
        localStorage.setItem('dinoByteLoggedUser', JSON.stringify(updatedUser));
        return true;
    }
    return false;
}

// Função para validar CPF
function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g,'');
    if(cpf == '') return false;
    
    // Elimina CPFs invalidos conhecidos
    if (cpf.length != 11 || 
        cpf == "00000000000" || 
        cpf == "11111111111" || 
        cpf == "22222222222" || 
        cpf == "33333333333" || 
        cpf == "44444444444" || 
        cpf == "55555555555" || 
        cpf == "66666666666" || 
        cpf == "77777777777" || 
        cpf == "88888888888" || 
        cpf == "99999999999")
        return false;
        
    // Valida 1o digito
    let add = 0;
    for (let i=0; i < 9; i++)     
        add += parseInt(cpf.charAt(i)) * (10 - i);  
    let rev = 11 - (add % 11);  
    if (rev == 10 || rev == 11)     
        rev = 0;    
    if (rev != parseInt(cpf.charAt(9)))     
        return false;   
        
    // Valida 2o digito
    add = 0;  
    for (let i = 0; i < 10; i++)  
        add += parseInt(cpf.charAt(i)) * (11 - i);  
    rev = 11 - (add % 11);  
    if (rev == 10 || rev == 11) 
        rev = 0;    
    if (rev != parseInt(cpf.charAt(10)))
        return false;   
        
    return true;   
}

// Função para verificar maioridade (18+)
function isOver18(birthDate) {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }
    
    return age >= 18;
}