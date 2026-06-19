function addMember(){

const name=document.getElementById("name").value;

let members=
JSON.parse(localStorage.getItem("members")) || [];

members.push({name});

localStorage.setItem(
"members",
JSON.stringify(members)
);

alert("Member Added");

}
