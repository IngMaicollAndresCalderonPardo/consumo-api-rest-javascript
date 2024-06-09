// const urlApiRandom = 'https://api.thecatapi.com/v1/images/search?limit=3&api_key=live_memktJOwuWszmFNcQHEdTOayrE1X8SlNhOL3bHOQydZJTayNwWBrgEVTAzWxcEdI';
// const urlApiFavorites = 'https://api.thecatapi.com/v1/favourites?limit=2';
const api = axios.create({
    baseURL:'https://api.thecatapi.com/v1'
});
api.defaults.headers.common['x-api-key'] = 'live_memktJOwuWszmFNcQHEdTOayrE1X8SlNhOL3bHOQydZJTayNwWBrgEVTAzWxcEdI' ;

const urlApiRandom = 'https://api.thecatapi.com/v1/images/search?limit=3';
const urlApiFavorites = 'https://api.thecatapi.com/v1/favourites';
const urlApiFavoritesDelete  = (id) => `https://api.thecatapi.com/v1/favourites/${id}`; 
const urlApiUpLoad = 'https://api.thecatapi.com/v1/images/upload';

const spanError = document.getElementById('error');

async function loadRandomMichis () {
    const res = await fetch(urlApiRandom);
    const data = await res.json();
    console.log("Random gatitos");
    console.log(data);

    if (res.status !== 200){
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    }
    else{
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const btn1 = document.getElementById('btn1');
        const btn2 = document.getElementById('btn2');

        img1.src = data[0].url;
        img2.src = data[1].url;
        btn1.onclick = () => saveFavouritesMichis(data[0].id);
        btn2.onclick = () => saveFavouritesMichis(data[1].id);

    }
    
}

async function loadFavoritesMichis () {
    const res = await fetch(urlApiFavorites,{
        method:'GET',
        headers:{
            'x-api-key':'live_memktJOwuWszmFNcQHEdTOayrE1X8SlNhOL3bHOQydZJTayNwWBrgEVTAzWxcEdI'
        }
    });
    const data = await res.json();
    console.log("Favorites gatitos");
    console.log(data);

    if (res.status !== 200){
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    }
    else
    {
        const section = document.getElementById('favoritesMichis');
        section.innerHTML = ""; 
        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('Michis Favoritos');
        h2.appendChild(h2Text);
        section.appendChild(h2);

       data.forEach(michi => {   
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnTexto = document.createTextNode('Eliminar al michi de favoritos');
            
            img.src = michi.image.url;
            img.width = 350;
            btn.appendChild(btnTexto);
            btn.onclick = ()=> deleteFavouritesMichis(michi.id)
            article.appendChild(img);
            article.appendChild(btn);
            section.appendChild(article);
        });
    }
}


async function saveFavouritesMichis(idMichi){
    
    const {data, status} = await api.post('/favourites',{
        image_id: idMichi
    })
    // const res = await fetch(urlApiFavorites,{
    //     method: 'POST',
    //     headers:{
    //         'content-type':'application/json',
    //         'x-api-key':'live_memktJOwuWszmFNcQHEdTOayrE1X8SlNhOL3bHOQydZJTayNwWBrgEVTAzWxcEdI'
    //     },
    //     body: JSON.stringify({
    //         image_id: idMichi
    //     }),
    // });

    console.log("save");
    console.log(data);

    if (status !== 200){
        spanError.innerHTML = "Hubo un error: " + status + data.message;
    } else{
        console.log('Michi guardado en favoritos');
        loadFavoritesMichis();
    }
}


async function deleteFavouritesMichis(idMichi){
    const res = await fetch(urlApiFavoritesDelete(idMichi),{
        method: 'DELETE',
        headers:{
            'x-api-key':'live_memktJOwuWszmFNcQHEdTOayrE1X8SlNhOL3bHOQydZJTayNwWBrgEVTAzWxcEdI'
        }
    });
    
    const data = await res.json();
    console.log("save");
    console.log(res);

    if (res.status !== 200){
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    }else{
        console.log('Michi eliminado de favoritos');
        loadFavoritesMichis();
    } 
}

async function uploadMichiPhoto(){
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);
    console.log(formData.get('file'))

    const res = await fetch(urlApiUpLoad,{
        method:'POST',
        headers:{
            'x-api-key':'live_memktJOwuWszmFNcQHEdTOayrE1X8SlNhOL3bHOQydZJTayNwWBrgEVTAzWxcEdI'    
        },
        body: formData
    })

    const data = await res.json();

    if (res.status !== 201){
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    }else{
        console.log('Michi subida a favoritos');
        console.log({data});
        console.log(data.url);
        saveFavouritesMichis(data.id);
    } 
}

loadRandomMichis();
loadFavoritesMichis();