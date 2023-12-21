fetch("./../messageCount.json")
  .then((response) => response.json())
  .then((json) => {
    
    // make the obj an array
    const countArray = Object.entries(json);
    console.log(countArray);

    countArray.sort((a, b) => b[1] - a[1]);
    console.log(countArray);

    countArray.forEach((author) => {
        const li = document.createElement("p");
        li.textContent = `${author[0]}: ${author[1]}`;
        document.querySelector("#messages").appendChild(li);
    });
  });

  fetch("./../threadsCreated.json")
    .then((response) => response.json())
    .then((json) => {
      // make the obj an array
      const countArray = Object.entries(json);
      console.log(countArray);

      countArray.sort((a, b) => b[1] - a[1]);
      console.log(countArray);

      countArray.forEach((author) => {
        const li = document.createElement("p");
        li.textContent = `${author[0]}: ${author[1]}`;
        document.querySelector("#threads").appendChild(li);
      });
    });