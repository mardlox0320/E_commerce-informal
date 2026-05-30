const API = "https://api-e-commerce-informal-1.onrender.com";
const loginbtn = document.getElementById("loginButton")
const email = document.getElementById("username")
const password = document.getElementById("password")
const nome = document.getElementById("name")
const h1login = document.getElementById("h1login")
const main = document.getElementById("main")
const log = document.getElementById("log")
const nomepro = document.getElementById("productName")
const Descricao = document.getElementById("productDescription")
const Preco = document.getElementById("productPrice")
const Estoque = document.getElementById("productQuantity")
const ImagemUrl = document.getElementById("productImageURL")
const carrinho = document.getElementById("Carrinho")
const total = document.getElementById("total")

const register = async () => {
    const response = await fetch(`${API}/api/Auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            Email: email.value,
            Password: password.value,
            Nome: nome.value
        })
    });
    email.value = "";
    password.value = "";
    nome.value = "";
    alert("Conta criada com sucesso! Faça login para continuar.");
};

const login = async () => {
    const response = await fetch(`${API}/api/Auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            Email: email.value,
            Password: password.value,
            Nome: nome.value
        })
    });
    if (!response.ok) {
        alert("Login falhou");
        return;
    }
    main.style.display = "block"
    log.style.display = "none"
}

function changecreate() {
    h1login.innerText = "Criar conta";
    loginbtn.innerText = "Criar conta";

    loginbtn.onclick = register; 
    mudar.innerText = "Já tem uma conta? fazer login";
    mudar.onclick = changecreateback; 
}

function changecreateback() {
    h1login.innerText = "Login";
    loginbtn.innerText = "Login";
    
    loginbtn.onclick = login;
    mudar.innerText = "não tem uma conta? criar conta";
    mudar.onclick = changecreate;
}

const me = async () => {
    const response = await fetch(`${API}/api/Auth/me`, {
        method: "GET",
        credentials: "include"
    })
    if (response.ok) {
        main.style.display = "flex"
        log.style.display = "none"
    }
    else {
        main.style.display = "none"
        log.style.display = "flex"
    }
};

const logout = async () => {
    const response = await fetch(`${API}/api/Auth/logout`, {
        method: "POST",
        credentials: "include"
    });
    window.location.reload();
}

const addProduct = async () => {
    const response = await fetch(`${API}/api/Products/addproduct`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            Nome: nomepro.value,
            Descricao: Descricao.value,
            Preco: parseFloat(Preco.value),
            Estoque: parseInt(Estoque.value),
            ImagemUrl: ImagemUrl.value
        })
    })  
    window.location.reload();
};

const productList = async () => {
    const response = await fetch(`${API}/api/Products/products`, {
        method: "GET",
        credentials: "include"
    }); 
    
    if (response.ok) {
        const data = await response.json();
        const listElement = document.getElementById("productList");
        
        listElement.innerHTML = data.map(product => `
            <li>
                <img src="${product.imagemUrl}" alt="${product.nome}" style="width:100px;"><br>
                <strong>${product.nome}</strong> - 
                ${product.descricao} - 
                R$ ${parseFloat(product.preco).toFixed(2)} - 
                Estoque: ${parseInt(product.estoque)} 
                <br>
                <button onclick="addToCart('${product.id}')" id="addToCartBtn">Adicionar ao Carrinho</button>
                <button onclick="delet('${product.id}')" id="deleteBtn" style="background-color: #dc3545; color: white; padding: 10px 20px; border: none; cursor: pointer;">Deletar</button>
                <button onclick="editar('${product.id}')" id="editBtn" style="background-color: #007bff; color: white; padding: 10px 20px; border: none; cursor: pointer;">Editar</button>
            </li>
        `).join('');
    }
};  

async function addToCart(produtoId) {
    const response = await fetch(`${API}/api/Carrinho/carrinhoadd`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ProdutoId: produtoId,
            Quantidade: 1
        })
    });
    if (!response.ok) {
        alert("Não foi possível adicionar ao carrinho");
        return;
    }
    else {
        alert("Produto adicionado ao carrinho");
    }
    window.location.reload();
}

const showCart = async () => {
    carrinho.style.display = "flex";
    main.style.display = "none";

    try {
        const response = await fetch(`${API}/api/Carrinho/carrinho`, {
            method: "GET",
            credentials: "include"
        });

        if (response.ok) {
            const data = await response.json();
            const cartListElement = document.getElementById("cartList");

            if (data.length === 0) {
                cartListElement.innerHTML = "<li>Seu carrinho está vazio.</li>";
                total.innerText = "Total: R$ 0.00";
            } else {
                cartListElement.innerHTML = data.map(item => `
                    <li>
                        <img src="${item.produto?.imagemUrl || ''}" alt="${item.produto?.nome || ''}" style="width:100px;"><br>
                        <strong>${item.produto?.nome || 'Produto'}</strong> - 
                        ${item.produto?.descricao || ''} - 
                        R$ ${item.produto ? parseFloat(item.produto.preco).toFixed(2) : '0.00'} - 
                        Quantidade: ${item.quantidade} 
                        <button onclick="removeFromCart('${item.id}')" id="deleteBtn">Remover do Carrinho</button>
                    </li>
                `).join('');
                
                const valorTotal = data.reduce((acc, item) => acc + (item.produto ? (item.produto.preco * item.quantidade) : 0), 0);
                total.innerText = `Total: R$ ${valorTotal.toFixed(2)}`;
            }
        }
    } catch (error) {
        console.error("Erro ao carregar o carrinho", error);
    }

    // Agora, com o return removido, esta linha será alcançada sempre!
    await showHistorico();
}

async function delet(id) {
    const response = await fetch(`${API}/api/Products/products/${id}`, {
        method: "DELETE",
        credentials: "include"
    });
    if (!response.ok) {
        const errorData = await response.json();
        console.error('Server responded with error:', errorData);
    }
    window.location.reload();
}

async function removeFromCart(Id) {
    const response = await fetch(`${API}/api/Carrinho/carrinho/${Id}`, {
        method: "DELETE",
        credentials: "include"
    });
    if (!response.ok) {
        const errorData = await response.json();
        console.error('Server responded with error:', errorData);
    }
    window.location.reload();
}

async function editar(id) {
    const newName = prompt("Novo nome do produto:");
    const newDescription = prompt("Nova descrição do produto:");
    const newPrice = parseFloat(prompt("Novo preço do produto:"));
    const newStock = parseInt(prompt("Novo estoque do produto:"));
    const newImageUrl = prompt("Nova URL da imagem do produto:");
    const response = await fetch(`${API}/api/Products/products/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome: newName,
            descricao: newDescription,
            preco: newPrice,
            estoque: newStock,
            imagemUrl: newImageUrl
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Server responded with error:', errorData);
    }
    window.location.reload();
}

const voltarParaLoja = () => {
    carrinho.style.display = "none";
    main.style.display = "flex";
}

window.onload = () => {
    me();
    productList();
}

const finalizarPedido = async () => {
    const response = await fetch(`${API}/api/Pedido/pedido`, {
        method: "POST",
        credentials: "include"
    });
    window.location.reload();
}

async function showHistorico() {
    const response2 = await fetch(`${API}/api/Pedido/pedidos/historico`, {
        method: "GET",
        credentials: "include"
    });
    const data = await response2.json();
    const historicoElement = document.getElementById("historico");
    historicoElement.innerHTML = data.map(pedido => `
        <li>
            <strong>Data:</strong> ${pedido.data}<br>
            <strong>Total:</strong> R$ ${parseFloat(pedido.total).toFixed(2)}
        </li>
    `).join('');
}
