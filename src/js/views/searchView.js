import {elements} from './base';
export const getInput =()=>elements.searchInput.value;

export const clearInput =()=>{
    elements.searchInput.value = '';
}

export const clearResults = () =>{
    elements.searchResultList.innerHTML ='';
    elements.searchResultPages.innerHTML= '';
}

//display the one line title
const limitRecipeTitle =(title,limit = 17) =>{
    const newTitle =[];
    if(title.length>limit){
        title.split(' ').reduce((acc,cur)=>{
            if(acc +cur.length<=limit){
                newTitle.push(cur);
            }
            return acc+cur.length;
        },0);

        //return the final result
        return `${newTitle.join(' ')}...`
    }
    return title;
}


const renderRecipe = recipe=>{
    const markup =`<li>
                    <a class="results__link results__link--active" href="#${recipe.recipe_id}">
                            <figure class="results__fig">
                                <img src="${recipe.image_url}" alt="${recipe.title}">
                            </figure>
                            <div class="results__data">
                                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                                <p class="results__author">T${recipe.publisher}</p>
                            </div> 
                    </a>
             </li>`;
             elements.searchResultList.insertAdjacentHTML('beforeend',markup);
};

const createButton = (page,type) =>`
<button class="btn-inline results__btn--${type}" data-goto = ${type==='prev' ? page - 1 : page + 1}
<span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
   
</button>`

const renderButton =(page,numResults, resPerPage)=>{
    const pages = Math.ceil(numResults/resPerPage);

    let button;
    if(page === 1 && pages > 1){
        //Button to go next page
        button = createButton(page,'next');

    } else if(page < pages){
        //Both buttons

        button = 
        `${createButton(page,'prev')}
         ${createButton(page,'next')}
        `;
         
    } else if(page === pages && page > 1 ){
        //Only one button to go previous page
        button = createButton(page,'prev');
    }
    elements.searchResultPages.insertAdjacentHTML('afterbegin',button);    

};

export const renderResults = (recipes,page=1,rePerPage=10) =>{
    //render results of current page
    const start = (page-1) * rePerPage;
    const end = page * rePerPage;
    recipes.slice(start,end).forEach(renderRecipe);

    //render buttons
    renderButton(page,recipes.length,rePerPage)
} 