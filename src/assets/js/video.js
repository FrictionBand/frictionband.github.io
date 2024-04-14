document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('backgroundVideo');
    const fallbackImage = document.getElementById('fallbackImage');

    // Function to hide the fallback image and show the video
    function showVideo() {
        fallbackImage.style.display = 'none'; // Hide fallback image
        video.style.display = 'block'; // Ensure video is visible
    }

    // Try to play the video and listen for the canplaythrough event
    if (video) {
        video.style.display = 'none'; // Initially hide the video to avoid showing play button
        fallbackImage.style.display = 'block'; // Show fallback image by default

        video.addEventListener('canplaythrough', showVideo); // Ensure full buffer before showing video
        video.play().then(() => {
            console.log("Video autoplayed successfully.");
            showVideo(); // Show video and hide fallback image if autoplay succeeds
        }).catch(error => {
            console.log("Autoplay failed due to browser policy. Error: ", error.message);
            // Autoplay failed: Keep showing fallback image and keep video hidden
        });
    } else {
        console.log("Video element not found. Ensure the ID is correct and the element exists in the DOM.");
    }
});
