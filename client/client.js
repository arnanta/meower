//console.log("Hello World")

//const { createDiffieHellman } = require("crypto");

const form=document.querySelector('form');   //grabbing an element on the page
const mewsElement=document.querySelector('.mews');
const loadingElement=document.querySelector('.loading');


const API_URL="http://localhost:5000/mews";

loadingElement.style.display='';
listAllMews();

form.addEventListener('submit',(event)=>{
    //console.log('Form is submitted');
    event.preventDefault();
    const formData=new FormData(form);
    const name=formData.get('name');
    const content=formData.get('content');
    //console.log("Form Submitted");
    const mew={
        name,content
    };
    //console.log(mew);
    form.style.display='none';
    loadingElement.style.display='';

    fetch(API_URL,{
        method:'POST',
        body:JSON.stringify(mew),
        headers:{

            'content-type':'application/json'
        }
    }).then(response=> response.json())
      .then(createdMew=>{
          //console.log(createdMew);

          form.reset();
          setTimeout(()=>{

            form.style.display='';
          },30000
          );
         
          //loadingElement.style.display='none';
          listAllMews();
      });



});
function listAllMews()
{
    mewsElement.innerHTML='';
    fetch(API_URL)
    .then(response=> response.json())
    .then(mews=>{
        console.log(mews);
        mews.reverse();
        mews.forEach(mew =>{
            const div=document.createElement('div');
            const header=document.createElement('h3');
            header.textContent=mew.name;

            const contents=document.createElement('p');
            contents.textContent=mew.content;
            const date=document.createElement('small');

            date.textContent= new Date(mew.created);
            
            
            
            
            div.appendChild(header);
            div.appendChild(contents);

            div.appendChild(date);
            mewsElement.appendChild(div);



        });

        loadingElement.style.display='none';


    });

}