# 🛒 E-Commerce Informal - API & Front-end

Este é um projeto full-stack de um e-commerce desenvolvido para demonstrar a integração entre um front-end dinâmico e uma API REST robusta com autenticação segura e persistência de dados em nuvem.

O projeto está totalmente implantado e funcional em ambiente de produção.

## 🚀 Tecnologias Utilizadas

### Back-end
* **C# / .NET Core**: Framework principal para construção da API REST.
* **Entity Framework Core & Pomelo**: ORM utilizado para mapeamento e manipulação do banco de dados MySQL.
* **JWT (JSON Web Tokens)**: Implementação de autenticação e autorização segura de usuários.
* **CORS (Cross-Origin Resource Sharing)**: Configuração personalizada para comunicação segura entre domínios distintos.

### Front-end
* **HTML5 & CSS3**: Estrutura e estilização responsiva da interface.
* **Vanilla JavaScript**: Manipulação assíncrona do DOM e integração com a API via `Fetch API`.

### Infraestrutura e Banco de Dados
* **MySQL**: Banco de dados relacional para persistência de usuários, produtos e pedidos.
* **Aiven**: Hospedagem em nuvem do banco de dados MySQL com conexões seguras via SSL.
* **Render**: Hospedagem e deploy contínuo (Docker/Web Service) da API .NET.
* **GitHub Pages**: Hospedagem e distribuição do front-end de forma estática e otimizada.

## 🛠️ Funcionalidades Principais

- **Autenticação Segura**: Fluxo completo de Registro e Login com validação de credenciais e geração de tokens JWT.
- **Validação de Dados Automatizada**: Proteção no back-end contra payloads corrompidos ou incompletos utilizando Data Annotations.
- **Inicialização Automática de Banco**: Verificação e criação automatizada de tabelas (`EnsureCreated`) assim que o serviço é iniciado na nuvem.
- **Consumo de API Assíncrono**: Comunicação fluida no front-end utilizando promises e manipulação dinâmica de erros no navegador.

## 📐 Arquitetura do Sistema

O projeto adota um modelo desacoplado (Decoupled Architecture):
1. O usuário interage com a interface estática no **GitHub Pages**.
2. O JavaScript dispara requisições HTTPS para o servidor do **Render**.
3. O servidor .NET processa a lógica de negócios, valida o token JWT e faz consultas seguras via SSL para o cluster MySQL no **Aiven**.
