// window.addEventListener('load', function(){
//     var docSections = document.querySelectorAll('[data-blockname]'),
//         menu = document.createElement('div');

//     menu.className = 'menu';

//     for(var i = 0; i < docSections.length; i++) {
//         var section = docSections[i],
//             sectionAnchor = document.createElement('a'),
//             sectionName = section.getAttribute('data-blockname');

//         section.insertBefore(sectionAnchor, section.firstChild);

//         var menuItem = document.createElement('a');
//         menuItem.innerText = sectionName;
//         menuItem.setAttribute('href', '#' + sectionName);

//         sectionAnchor.setAttribute('name', sectionName);
//         sectionAnchor.className = 'sectionAnchor';

//         menu.appendChild(menuItem);
//     }

//     document.body.insertBefore(menu, document.body.firstChild);
// });