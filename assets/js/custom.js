// Global object to store all selected values
window.formData = {
  citizenship: "",
  zipcode: "",
  age: "",
  is_insured: "",
  insurance_company: "",
};

// scroll to Bottom Function
function scrollToBottom() {
  const chatBody = document.querySelector(".chatBody");
  const chatContainer = document.querySelector(".chat-container");

  // Add extra padding or margin at the bottom
  chatContainer.style.paddingBottom = "150px"; // Adjust the value as needed

  // Scroll to the bottom
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Modify the existing scrollToBottom function or add this alongside it
function enhancedScrollToBottom() {
  const chatContainer = document.querySelector(".chat-container");

  // Add extra space for specific blocks
  const blocksToAddSpace = [
    "agentBlock1",
    "agentBlockCitizenship",
    // Add other block IDs you want to have extra space
    "agentBlockZipCode",
    "agentBlockage",
  ];

  blocksToAddSpace.forEach((blockId) => {
    const block = document.getElementById(blockId);
    if (block) {
      block.style.marginBottom = "50px"; // Adjust the value as needed
    }
  });

  // Scroll to bottom
  scrollToBottom();
}
function showTypingIndicator() {
  const typingIndicator = document.createElement("div");
  typingIndicator.id = "typingIndicator";
  typingIndicator.className = "typing-indicator";
  typingIndicator.innerHTML = "<span></span><span></span><span></span>";
  document.querySelector(".chatBody").appendChild(typingIndicator);
  scrollToBottom();
}

function hideTypingIndicator() {
  const typingIndicator = document.getElementById("typingIndicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// First, add the function definition at the top of your custom.js
function showInsuranceCompanyQuestion() {
  const msgCountry = document.getElementById("msgCountry");
  const countrySelectContainer = document.getElementById(
    "countrySelectContainer"
  );

  // Show the question div
  msgCountry.classList.remove("hidden");

  // Apply typing effect
  let text = "Select Your Insurance Company";
  let index = 0;

  function typeText() {
    if (index < text.length) {
      msgCountry.querySelector(".agent-question-text").textContent +=
        text.charAt(index);
      index++;
      setTimeout(typeText, 50); // Adjust typing speed here
    } else {
      // Typing effect complete, show the select options after a short delay
      setTimeout(() => {
        countrySelectContainer.classList.remove("hidden");
      }, 500); // Adjust delay as needed
    }
  }

  // Start typing effect
  msgCountry.querySelector(".agent-question-text").textContent = "";
  typeText();
}

document.addEventListener("DOMContentLoaded", function () {
  let citizenshipValue = "";
  let zipcodeValue = "";
  let ageValue = "";

  // Handle citizenship buttons
  const citizenshipButtons = document.querySelectorAll(
    'button[data-form-step="citizenship"]'
  );

  citizenshipButtons.forEach((button) => {
    button.addEventListener("click", function () {
      citizenshipButtons.forEach((btn) => btn.classList.remove("selected"));
      this.classList.add("selected");
      citizenshipValue = this.getAttribute("data-form-value").toLowerCase();
    });
  });

  // Handle zipcode input
  const zipcodeInput = document.getElementById("zipCodeInput");
  if (zipcodeInput) {
    zipcodeInput.addEventListener("change", function () {
      zipcodeValue = this.value;
    });
  }

  // Handle age input
  const ageInput = document.getElementById("ageInput");
  if (ageInput) {
    ageInput.addEventListener("change", function () {
      ageValue = this.value;
    });
  }

  // Handle insurance question buttons
  const insuranceYesButton = document.querySelector(
    'button[data-form-step="3"][data-form-value="Yes"]'
  );
  const insuranceNoButton = document.querySelector(
    'button[data-form-step="3"][data-form-value="No"]'
  );

  if (insuranceYesButton) {
    insuranceYesButton.addEventListener("click", function () {
      // Do nothing when "Yes" is clicked
    });
  }

  if (insuranceNoButton) {
    insuranceNoButton.addEventListener("click", function () {
      updateFullURL("UNKNOWN");
    });
  }

  function updateFullURL(insuranceStatus) {
    let currentUrl = new URL(window.location.href);

    // Clear all parameters
    for (let param of currentUrl.searchParams.keys()) {
      currentUrl.searchParams.delete(param);
    }

    // Add parameters in desired order
    if (citizenshipValue) {
      currentUrl.searchParams.set("citizenship", citizenshipValue);
    }
    if (zipcodeValue) {
      currentUrl.searchParams.set("zipcode", zipcodeValue);
    }
    if (ageValue) {
      currentUrl.searchParams.set("age", ageValue);
    }
    currentUrl.searchParams.set("is_insured", insuranceStatus);

    window.history.pushState({}, "", currentUrl);
    console.log("Updated full URL:", currentUrl.toString());
  }
});

// Function to load the Ringba script and update the phone number
function loadRingbaScript() {
  console.log("Attempting to load Ringba script...");
  const script = document.createElement("script");
  script.src = "//b-js.ringba.com/CAf48475b102d441f384fa42a37d53e56a";
  script.async = true;

  script.onload = function () {
    console.log("Ringba script loaded successfully");
  };

  script.onerror = function () {
    console.error("Failed to load Ringba script");
  };

  document.body.appendChild(script);
}

// Call the function to load Ringba
loadRingbaScript();

// Function to update the URL with all selected values
function updateUrlWithAllValues() {
  const url = new URL(window.location);

  // Clear existing parameters
  url.search = "";

  // Add all non-empty values to URL
  Object.entries(window.formData).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  // Update URL
  window.history.replaceState({}, "", url);

  // Log for debugging
  console.log("Updated URL with form data:", window.formData);
}

// Function to update a specific form value
function updateFormValue(key, value) {
  if (key === "insuranceStatus") {
    key = "is_insured";
    // When insurance status is "Yes", set value to "OTHER"
    if (value === "Yes") {
      value = "OTHER";
    } else if (value === "No") {
      value = "UNKNOWN";
    }
  } else if (key === "insuranceCompany") {
    key = "insurance_company";
    // Make sure the insurance company value is preserved
    value = value.toUpperCase();
  } else if (key === "zipCode") {
    key = "zipcode";
  } else if (key === "citizenship") {
    if (value === "Yes") {
      value = "yes";
    } else if (value === "No") {
      value = "no";
    }
  }

  // Make sure window.formData exists
  if (!window.formData) {
    window.formData = {};
  }

  // Update the form data
  window.formData[key] = value;

  // For debugging
  console.log(`Updated ${key} with value: ${value}`);
  console.log("Current formData:", window.formData);
}

// Function to simulate typing effect for the message
function typeMessage(elementId, message, delay) {
  const element = document.getElementById(elementId);
  if (!element) return;

  element.textContent = "";
  let index = 0;

  const typingInterval = setInterval(() => {
    if (index < message.length) {
      element.textContent += message.charAt(index);
      index++;
    } else {
      clearInterval(typingInterval);
    }
  }, delay);
}

// Event listeners for each response option
document.addEventListener("DOMContentLoaded", () => {
  // Citizenship buttons
  document
    .querySelectorAll("#citizenshipButtons .chat-button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const response = button.getAttribute("data-form-value");
        updateFormValue("citizenship", response);
      });
    });

  // ZIP Code input
  document.getElementById("zipCodeSubmit")?.addEventListener("click", () => {
    const zipCode = document.getElementById("zipCodeInput")?.value;
    if (zipCode) {
      updateFormValue("zipCode", zipCode);
    }
  });

  // Age input
  document.getElementById("ageSubmit")?.addEventListener("click", () => {
    const age = document.getElementById("ageInput")?.value;
    if (age) {
      updateFormValue("age", age);
    }
  });

  // Insurance status buttons (including "No" button)
  document.querySelectorAll(".finishquiz").forEach((button) => {
    button.addEventListener("click", () => {
      const response = button.getAttribute("data-form-value");
      updateFormValue("insuranceStatus", response);

      // Update button states
      document.querySelectorAll(".finishquiz").forEach((btn) => {
        btn.setAttribute("data-selected", "false");
      });
      button.setAttribute("data-selected", "true");

      // If "No" is clicked, update URL and show values
      if (response === "No") {
        updateUrlWithAllValues();
        showCongratulationsMessage();
      }
    });
  });

  // Insurance company selection
  document.getElementById("countrySelect")?.addEventListener("change", () => {
    const insuranceCompany = document.getElementById("countrySelect").value;
    if (insuranceCompany) {
      updateFormValue("insurance_company", insuranceCompany);

      // Now update the URL with all collected data
      updateUrlWithAllValues();

      // Display the selected insurance company
      const msgUserCountry = document.getElementById("msgUserCountry");
      if (msgUserCountry) {
        msgUserCountry.textContent = `You Selected: ${insuranceCompany}`;
        msgUserCountry.classList.remove("hidden");
      }
      document.getElementById("userBlockCountry")?.classList.remove("hidden");

      showCongratulationsMessage();
      setTimeout(scrollToBottom, 0);
    } else {
      alert("Please select an insurance company.");
    }
  });
});

function showCongratulationsMessage() {
  // Show congratulations message
  setTimeout(() => {
    document.getElementById("msg13")?.classList.remove("hidden");
    typeMessage("congratulationsMsg", "Congratulations, You Qualify!! ", 100);

    // Load Ringba script when congratulations message is shown
    loadRingbaScript();
  }, 2000);

  document.getElementById("agentBlock4")?.classList.remove("hidden");
  document.getElementById("countrySelectContainer")?.classList.add("hidden");
}

// Set countdown duration in minutes
var startTime = 3.0; // 3 minutes

// Optional class for styling when timer is done
var doneClass = "done";

function startTimer(duration, display) {
  var timer = duration,
    minutes,
    seconds;
  var intervalLoop = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    // Update all display elements
    for (var i = 0; i < display.length; i++) {
      display[i].textContent = minutes + ":" + seconds;
    }

    // Check if timer has finished
    if (--timer < 0) {
      for (var i = 0; i < display.length; i++) {
        display[i].classList.add(doneClass);
        display[i].textContent = "DONE";
      }
      clearInterval(intervalLoop);
    }
  }, 1000);
}

document.addEventListener("DOMContentLoaded", function () {
  var display = [document.getElementById("timer")]; // Select timer display
  var duration = startTime * 60; // Convert minutes to seconds
  startTimer(duration, display);
});

$(document).ready(function () {
  var tempCssClass;

  setTimeout(function () {
    $("#initTyping").remove();
    $("#msg1").removeClass("hidden").after(typingEffect());
    setTimeout(function () {
      $(".temp-typing").remove();
      $("#msg2").removeClass("hidden").after(typingEffect());
      setTimeout(scrollToBottom, 0);
      setTimeout(function () {
        $(".temp-typing").remove();
        $("#msg3").removeClass("hidden").after(typingEffect());
        setTimeout(scrollToBottom, 0);
        setTimeout(function () {
          $(".temp-typing").remove();
          $("#msg4").removeClass("hidden");
        }, 0);
      }, 1750);
    }, 1250);
  }, 750);

  var buttonValue;
  var currentStep;

  $("button.chat-button, #zipCodeSubmit, #countrySelectSubmit, #ageSubmit").on(
    "click",
    function () {
      currentStep = $(this).attr("data-form-step");
      buttonValue = $(this).attr("data-form-value");

      // Step for US citizenship question
      if (currentStep == "citizenship") {
        $("#agentBlockZipCode .agent-chat").prepend(typingEffect());
        $("#citizenshipButtons").addClass("hidden");
        $("#userBlockCitizenship").removeClass("hidden");

        if (buttonValue == "Yes") {
          $("#msgUserCitizenshipYes").removeClass("hidden");
        } else {
          $("#msgUserCitizenshipNo").removeClass("hidden");
        }

        setTimeout(scrollToBottom, 0);
        setTimeout(function () {
          $("#agentBlockZipCode").removeClass("hidden");
          setTimeout(scrollToBottom, 0);
          setTimeout(function () {
            $(".temp-typing").remove();
            $("#msgZipCode").removeClass("hidden").after(typingEffect());
            setTimeout(scrollToBottom, 0);
            setTimeout(function () {
              $(".temp-typing").remove();
              $("#zipCodeInputContainer").removeClass("hidden");
              setTimeout(scrollToBottom, 0);
            }, 750);
          }, 2250);
        }, 50);
      }

      // Step for zip code input
      if (currentStep == "zipCode") {
        var zipCode = $("#zipCodeInput").val();
        if (/^\d{5}$/.test(zipCode)) {
          $("#zipCodeInputContainer").addClass("hidden");
          $("#userBlockZipCode").removeClass("hidden");
          $("#msgUserZipCode").text(zipCode).removeClass("hidden");

          setTimeout(scrollToBottom, 0);
          setTimeout(function () {
            $("#agentBlockage").removeClass("hidden");
            setTimeout(scrollToBottom, 0);
            setTimeout(function () {
              $(".temp-typing").remove();
              $("#msgage").removeClass("hidden").after(typingEffect());
              setTimeout(scrollToBottom, 0);
              setTimeout(function () {
                $(".temp-typing").remove();
                $("#ageInputContainer").removeClass("hidden");
                setTimeout(scrollToBottom, 0);
              }, 750);
            }, 1750);
          }, 750);
        } else {
          alert("Please enter a valid 5-digit zip code.");
        }
      }

      // Step for age input
      if (currentStep == "age") {
        var age = $("#ageInput").val();
        if (/^\d{2}$/.test(age)) {
          $("#ageInputContainer").addClass("hidden");
          $("#userBlockage").removeClass("hidden");
          $("#msgUserage").text(age).removeClass("hidden");

          setTimeout(scrollToBottom, 0);
          setTimeout(function () {
            $("#agentBlock3").removeClass("hidden");
            setTimeout(scrollToBottom, 0);
            setTimeout(function () {
              $(".temp-typing").remove();
              $("#msg10").removeClass("hidden").after(typingEffect());
              setTimeout(scrollToBottom, 0);
              setTimeout(function () {
                $(".temp-typing").remove();
                $("#msg11").removeClass("hidden");
                setTimeout(scrollToBottom, 0);
              }, 750);
            }, 1750);
          }, 750);
        } else {
          alert("Please enter a valid 2-digit Age.");
        }
      }

      // Step for citizenship question
      if (currentStep == 1) {
        $("#agentBlockCitizenship").removeClass("hidden");

        setTimeout(function () {
          $(".temp-typing").remove();
          $("#msg6").removeClass("hidden").after(typingEffect());
        }, 750);

        setTimeout(scrollToBottom, 0);
        setTimeout(function () {
          $(".temp-typing").remove();
          $("#msgCitizenship").removeClass("hidden").after(typingEffect());
          setTimeout(scrollToBottom, 0);
          setTimeout(function () {
            $(".temp-typing").remove();
            $("#citizenshipButtons").removeClass("hidden");
            setTimeout(scrollToBottom, 0);
          }, 1250);
        }, 1250);
      }

      // Step for insurance question
      if (currentStep == 3) {
        $("#msg11").addClass("hidden");
        $("#userBlock3").removeClass("hidden");

        if (buttonValue == "No") {
          $("#msg12no").removeClass("hidden");
          formData.is_insured = "UNKNOWN";
          updateURLParameters(); // Update URL parameters
          $(".temp-typing").remove();
          setTimeout(scrollToBottom, 0);

          setTimeout(function () {
            displayCongratulationsMessages();
          }, 750);
        } else if (buttonValue == "Yes") {
          $("#msg12yes").removeClass("hidden");
          formData.is_insured = "OTHER"; // Set default insurance value to "OTHER"
          // updateURLParameters(); // Update URL parameters
          setTimeout(scrollToBottom, 0);

          // Show country selection if "Yes"
          setTimeout(function () {
            $("#agentBlockCountry").removeClass("hidden");
            $("#msgCountry").removeClass("hidden");
            $("#countrySelectContainer").removeClass("hidden");
            setTimeout(scrollToBottom, 0);
          }, 750);

          // Add event listener for country selection
          $("#countrySelect").on("change", function () {
            let selectedCountry = $(this).val();
            if (selectedCountry) {
              $("#userBlockCountry").removeClass("hidden");
              $("#msgUserCountry").removeClass("hidden").text(selectedCountry);
              setTimeout(scrollToBottom, 0);

              setTimeout(function () {
                displayCongratulationsMessages();
              }, 750);
            }
          });
        }
      }

      // Function to update URL parameters
      function updateURLParameters() {
        let currentUrl = new URL(window.location.href);
        let params = new URLSearchParams(currentUrl.search);

        // Update all form data parameters
        for (let key in formData) {
          if (formData[key]) {
            params.set(key, formData[key]);
          }
        }

        // Update URL without refreshing the page
        window.history.replaceState(
          {},
          "",
          `${currentUrl.pathname}?${params.toString()}`
        );
      }

      // Step for country selection
      if (currentStep == "country") {
        // $("#agentBlockCountry .agent-chat").prepend(typingEffect());
        $("#countrySelectContainer").addClass("hidden");
        $("#userBlockCountry").removeClass("hidden");

        // Display selected country
        var selectedCountry = $("#countrySelect option:selected").text();
        $("#msgUserCountry").text(selectedCountry).removeClass("hidden");

        setTimeout(scrollToBottom, 0);

        // Proceed to congratulations messages after country selection
        setTimeout(function () {
          displayCongratulationsMessages();
        }, 750);
      }

      // Function to display congratulations messages
      function displayCongratulationsMessages() {
        $("#agentBlock4").removeClass("hidden");
        $(".temp-typing").remove(); // Remove any existing typing effects
        setTimeout(scrollToBottom, 0);

        $("#msg13").removeClass("hidden");
        $("#msg14").removeClass("hidden");
        $("#msg15").removeClass("hidden");
        $("#msg16").removeClass("hidden");
        $("#msg17").removeClass("hidden");
        $("#msg17a").removeClass("hidden");
        setTimeout(scrollToBottom, 0);
      }
    }
  );
});

function typingEffect(cssClass) {
  string =
    '<div class="temp-typing bg-gray-200 p-3 rounded-lg shadow-xs mt-2 inline-block">';
  string += '<div class="typing-animation">';
  string += '<div class=" "></div>';
  string += '<div class="typing-dot"></div>';
  string += '<div class="typing-dot"></div>';
  string += "</div>";
  string += "</div>";

  return string;
}

var daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

var currentDate = new Date();
var currentDayOfWeek = daysOfWeek[currentDate.getDay()];
var currentMonth = months[currentDate.getMonth()];
var currentDay = currentDate.getDate();
var currentYear = currentDate.getFullYear();
var formattedDate =
  currentDayOfWeek +
  ", " +
  ("0" + (currentDate.getMonth() + 1)).slice(-2) +
  "/" +
  ("0" + currentDay).slice(-2) +
  "/" +
  currentYear;
document.getElementById("currentDate").textContent = formattedDate;

var triggerOfferwall = function () {
  setTimeout(function () {
    window.open("https://dwizr.com/?a=7669&c=3792&p=r&s1", "_blank");
  }, 10000);
};

// Insurance company selection
document.getElementById("countrySelect")?.addEventListener("change", () => {
  const insuranceCompany = document.getElementById("countrySelect").value;
  if (insuranceCompany) {
    updateFormValue("insuranceCompany", insuranceCompany);

    // Update the URL with all collected data
    updateUrlWithAllValues();

    // Display the selected insurance company
    const msgUserCountry = document.getElementById("msgUserCountry");
    if (msgUserCountry) {
      msgUserCountry.textContent = `You Selected: ${insuranceCompany}`;
      msgUserCountry.classList.remove("hidden");
    }
    document.getElementById("userBlockCountry")?.classList.remove("hidden");

    showCongratulationsMessage();
  } else {
    alert("Please select an insurance company.");
  }
});

function showCongratulationsMessage() {
  // Show congratulations message
  setTimeout(() => {
    // Show msg13 container
    document.getElementById("msg13")?.classList.remove("hidden");

    // Show typing effect for congratulations message
    typeMessage("congratulationsMsg", "Congratulations, You Qualify!! ", 100);

    // Show additional messages with delays
    setTimeout(() => {
      document.getElementById("msg14")?.classList.remove("hidden");
      setTimeout(() => {
        document.getElementById("msg16")?.classList.remove("hidden");
        setTimeout(() => {
          document.getElementById("msg17")?.classList.remove("hidden");
          document.getElementById("msg17a")?.classList.remove("hidden");

          // Load Ringba script when congratulations message is shown
          loadRingbaScript();

          // Scroll to bottom after all messages are shown
          setTimeout(scrollToBottom, 0);
        }, 1000);
      }, 1000);
    }, 1000);
  }, 2000);

  // Hide country select container and show agent block
  document.getElementById("agentBlock4")?.classList.remove("hidden");
  document.getElementById("countrySelectContainer")?.classList.add("hidden");
}

// Add this for the country select field
document
  .getElementById("countrySelect")
  .addEventListener("change", function () {
    const selectedValue = this.value;
    if (selectedValue) {
      // Show user response
      document.getElementById("userBlockCountry").classList.remove("hidden");
      document.getElementById("msgUserCountry").classList.remove("hidden");
      document.getElementById("msgUserCountry").textContent = selectedValue;
      scrollToBottom();

      // Show typing indicator
      showTypingIndicator();

      // Show the congratulations message without delay
      setTimeout(() => {
        hideTypingIndicator();
        document.getElementById("agentBlock4").classList.remove("hidden");
        document.getElementById("msg13").classList.remove("hidden");
        scrollToBottom(); // Scroll immediately when the message appears
      }, 1500);
    }
  });

document
  .querySelector('[data-form-value="Yes"]')
  .addEventListener("click", function () {
    history.pushState(null, "", window.location.pathname);
  });
