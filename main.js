const mealsEl= document.getElementById("meals");
const favcontainer= document.getElementById("fav-meals");
const searchTerm= document.getElementById("search-term");
console.log(searchTerm);
const searchBtn=document.getElementById("search");
getRandomMeal()
fetchFavMeal()
async function getRandomMeal()
{
    const resp=await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    const data= await resp.json();
    const randMeal=data.meals[0];
    //console.log(randMeal);
    addMeal(randMeal,true);
    
}
async function getmealById(id)
{
    console.log(id);
    const resp = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    )
    const respData=await resp.json();
    //console.log(respData);
    const meal = respData.meals[0];
    return meal;
}
async function getMealBySearch(term)
{
     const resp= await fetch
     (`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
     const respData = await resp.json();
     console.log(respData);
     const meal = respData.meals;
     console.log(meal);
     return meal;
}
function addMeal(mealData, random=false)
{
   const meal=document.createElement('div');
    meal.classList.add('meal');
   meal.innerHTML=
       `<div class="meal-header">    
          ${random ? 
           `<span class="mealspan"> Must Try</span>` : ''
           }  
        <img src="${mealData.strMealThumb}"/>
         </div>
    <div class="meal-body">
        <span class="text">${mealData.strMeal}</span>
        <button class="like-button">
        <i class="fas fa-heart"></i>
        </button>
    </div>`
    ;
    const btn=meal.querySelector(".like-button")
    btn.addEventListener("click", ()=>
    {
        if(btn.classList.contains("like-active"))
        {
            RemoveLs(mealData.idMeal);
            //console.log(mealData.idMeal);
            btn.classList.remove("like-active");
        }
        else{
            addToLs(mealData.idMeal);
            //console.log(mealData.idMeal);
        btn.classList.add("like-active");
        }
        fetchFavMeal();
        
    });
    meals.appendChild(meal);
}
function addToLs(mealid)
{
    const mealids=getMealLs();
   localStorage.setItem(
    "mealids", 
   JSON.stringify([...mealids, mealid]));
}
function RemoveLs(mealid)
{
    const mealids=getMealLs();
    localStorage.setItem(
        "mealids",
     JSON.stringify(mealids.filter((id) => id!==mealid)));
}
function getMealLs()
{
    const mealids= JSON.parse(localStorage.
        getItem("mealids"));
        
    return mealids === null ? [] : mealids;
}
async function fetchFavMeal()
{
    favcontainer.innerHTML = "";
    const mealids=getMealLs();
    for(let i=0; i<mealids.length;i++)
    {
        const mealid=mealids[i];
        //console.log(mealid);
        const meal=await getmealById(mealid);
        addMealFav(meal);
        
    }
    
    
}
function addMealFav(mealData)
{
   const favMeal=document.createElement('li');
   favMeal.innerHTML=`
   
   <img 
   src="${mealData.strMealThumb}"

    width="60px" height="60px"/>
        <span>
         ${mealData.strMeal}
        </span>
        <button class="clear"><i class="fas fa-window-close"></i></button>
    `
    ;
    const btn=favMeal.querySelector('.clear');
    btn.addEventListener("click", () =>
    {
        RemoveLs(mealData.idMeal);
        fetchFavMeal();
    })
    
    
    favcontainer.appendChild(favMeal);
}
searchBtn.addEventListener('click',async()=>
{
    mealsEl.innerHTML="";
   const search= searchTerm.value;
   console.log(search);
   const meals= await getMealBySearch(search);
   console.log(meals);
   if(!meals)
   {
    alert("Dish not found");
   }
   else
   {
   meals.forEach(meal => {
    addMeal(meal);
   });
   }
})