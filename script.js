//отримуємо статус бари ціни
const backblazeBar = document.querySelector(".backblaze");
const bunnyBar = document.querySelector(".bunny");
const scalewayBar = document.querySelector(".scaleway");
const vultrBar = document.querySelector(".vultr");

//отримуємо елементи radio щоб знати які позиції в bunny та  scaleway обрав користувач
const radiosBunny = document.querySelectorAll('input[name ="storage"]');
const radiosScaleway = document.querySelectorAll(
  'input[name ="scaleway-service"]'
);

let radiosBunnyValue;
let radiosScalewayValue;

radiosBunny.forEach((radio) => {
  if (radio.checked) {
    radiosBunnyValue = radio.value;
  }
});
radiosScaleway.forEach((radio) => {
  if (radio.checked) {
    radiosScalewayValue = radio.value;
  }
});

// беремо елементи повзунка та значення storage
const storageSlider = document.getElementById("storage-slider");
const storageValue = document.getElementById("storage-value");

// беремо елементи повзунка та значення transfer
const transferSlider = document.getElementById("transfer-slider");
const transferValue = document.getElementById("transfer-value");

//змінюємо значення storageValue та transferValue відповідно до позиції повзунка слайдерів
storageValue.textContent = storageSlider.value;
transferValue.textContent = transferSlider.value;
/*
беремо дані про ціни, в данному випадку це json файл який я створив
вручну відповідно до наданих вами данних
*/
fetch("platforms.json")
  .then((response) => response.json())
  .then((data) => {
    // робимо змінну для окремого збереження данних постачальників послуг
    let backblazeData = data["backblaze"];
    let bunnyData = data["bunny"];
    let scalewayData = data["scaleway"];
    let vultrData = data["vultr"];

    //функційні вирази для обрахування прайсу кожної з компаній відповідно до введених даних

    let backblazePrice = function () {
      let price =
        storageSlider.value * backblazeData.storage_price +
        transferSlider.value * backblazeData.transfer_price;
      if (price < 7) {
        return (price = 7);
      }

      return price.toFixed(2);
    };
    let bunnyPrice = function () {
      let price;
      if (radiosBunnyValue == "SSD") {
        price =
          storageSlider.value * bunnyData.storage_price.SSD +
          transferSlider.value * bunnyData.transfer_price;
      }
      if (radiosBunnyValue == "HDD") {
        price =
          storageSlider.value * bunnyData.storage_price.HDD +
          transferSlider.value * bunnyData.transfer_price;
      }
      if (price > 10) {
        price = 10;
      }

      return price.toFixed(2);
    };
    let scalewayPrice = function () {
      let price = 0;
      let discount = scalewayData.transfer_price.free;
      let storageValue = storageSlider.value - discount;
      let transferValue = transferSlider.value - discount;

      if (storageValue <= 0 && transferValue <= 0) {
        return 0;
      }

      if (storageValue <= 0 && transferValue > 0) {
        price = transferValue * scalewayData.transfer_price.price;
      }

      if (storageValue > 0 && transferValue <= 0) {
        if (radiosScalewayValue == "Single") {
          price = storageValue * scalewayData.storage.Single.price;
        }
        if (radiosScalewayValue == "Multi") {
          price = storageValue * scalewayData.storage.Multi.price;
        }
      }
      if (storageValue > 0 && transferValue > 0) {
        if (radiosScalewayValue == "Single") {
          price =
            storageValue * scalewayData.storage.Single.price +
            transferValue * scalewayData.transfer_price.price;
        }
        if (radiosScalewayValue == "Multi") {
          price =
            storageValue * scalewayData.storage.Multi.price +
            transferValue * scalewayData.transfer_price.price;
        }
      }

      return price.toFixed(2);
    };
    let vultrPrice = function () {
      let price =
        storageSlider.value * vultrData.storage_price +
        transferSlider.value * vultrData.transfer_price;
      if (price < vultrData.minimum_payment) {
        price = vultrData.minimum_payment;
      }
      return price.toFixed(2);
    };

    //ініціалізуємо значення в графіку при завантаженні сторінки відповідно до введених значень
    function calcBarHeight() {
      backblazeBar.style.height = backblazePrice() * 5 + "px";
      backblazeBar.textContent = backblazePrice() + "$";

      bunnyBar.style.height = bunnyPrice() * 5 + "px";
      bunnyBar.textContent = bunnyPrice() + "$";

      scalewayBar.style.height = scalewayPrice() * 5 + "px";
      scalewayBar.textContent = scalewayPrice() + "$";

      vultrBar.style.height = vultrPrice() * 5 + "px";
      vultrBar.textContent = vultrPrice() + "$";
    }
    calcBarHeight();

    function findMinPrice() {
      // Виконуємо попередні налаштування цін

      // знаходимо всі ціни
      let prices = [
        backblazePrice(),
        bunnyPrice(),
        scalewayPrice(),
        vultrPrice(),
      ];

      // знаходимо мінімальну ціну
      let minPrice = Math.min(...prices);
      console.log(minPrice);
      // проходимо через всі статус-бари цін та додаємо клас "min-price" для статус-бару з мінімальною ціною
      backblazeBar.classList.remove("min-price");
      bunnyBar.classList.remove("min-price");
      scalewayBar.classList.remove("min-price");
      vultrBar.classList.remove("min-price");

      if (minPrice >= backblazePrice()) {
        backblazeBar.classList.add("min-price");
      } else if (minPrice >= bunnyPrice()) {
        bunnyBar.classList.add("min-price");
      } else if (minPrice >= scalewayPrice()) {
        scalewayBar.classList.add("min-price");
      } else if (minPrice >= vultrPrice()) {
        vultrBar.classList.add("min-price");
      }
    }
    findMinPrice();
    // оновлюємо данні графіку відповідно до введених данних
    storageSlider.oninput = function () {
      storageValue.textContent = storageSlider.value;
      calcBarHeight();
      findMinPrice();
    };

    transferSlider.oninput = function () {
      transferValue.textContent = transferSlider.value;
      calcBarHeight();
      findMinPrice();
    };

    radiosBunny.forEach((elem) => {
      elem.addEventListener("change", () => {
        console.log(elem.value);
        let bunnyPrice;
        if (elem.value == "SSD") {
          bunnyPrice =
            storageSlider.value * bunnyData.storage_price.SSD +
            transferSlider.value * bunnyData.transfer_price;
        }
        if (elem.value == "HDD") {
          bunnyPrice =
            storageSlider.value * bunnyData.storage_price.HDD +
            transferSlider.value * bunnyData.transfer_price;
        }
        if (bunnyPrice > 10) {
          bunnyPrice = 10;
        }
        bunnyBar.style.height = bunnyPrice.toFixed(2) * 5 + "px";
        bunnyBar.textContent = bunnyPrice.toFixed(2) + "$";
        findMinPrice();
      });
    });
    radiosScaleway.forEach((elem) => {
      elem.addEventListener("change", () => {
        let discount = scalewayData.transfer_price.free;
        let storageValue = storageSlider.value - discount;
        let transferValue = transferSlider.value - discount;
        let scalewayPrice;

        if (storageValue > 0 && transferValue <= 0) {
          if (elem.value == "Single") {
            scalewayPrice = storageValue * scalewayData.storage.Single.price;
          }
          if (elem.value == "Multi") {
            scalewayPrice = storageValue * scalewayData.storage.Multi.price;
          }
        }
        if (storageValue > 0 && transferValue > 0) {
          if (elem.value == "Single") {
            scalewayPrice =
              storageValue * scalewayData.storage.Single.price +
              transferValue * scalewayData.transfer_price.price;
          }
          if (elem.value == "Multi") {
            scalewayPrice =
              storageValue * scalewayData.storage.Multi.price +
              transferValue * scalewayData.transfer_price.price;
          }
        }
        scalewayBar.style.height = scalewayPrice.toFixed(2) * 5 + "px";
        scalewayBar.textContent = scalewayPrice.toFixed(2) + "$";
        findMinPrice();
      });
    });

    // console.log(vultrPrice() * 5 + "px");
  })
  .catch((error) => {
    // Обробка помилок
    console.error(error);
  });
