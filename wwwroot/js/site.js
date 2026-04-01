async function callApiHRM(procedureName, paramArr) {
    try {
        const payload = {
            databaseName: "HRM",
            procedureName: procedureName,
            param: paramArr
        };                          

        const response = await axios.post('/api/proxy/execute', payload);

        if (response.data && response.data.success && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        console.log("FULL RESPONSE:", response.data);            


        throw new Error('API response is invalid');
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const btnAction = document.getElementById('toggleSidebar');
    const body = document.getElementById('main');

    btnAction.addEventListener('click', function () {
        sidebar.classList.toggle('collapsed');
        sidebar.classList.toggle('hinditem');
        sidebar.classList.toggle('hind');
        body.classList.toggle('no-sidebar');

        // ✅ toggle class đúng cách
        btnAction.classList.toggle('active');
    });
}

initSidebar();