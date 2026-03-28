// package com.example.demo.controller;

// import org.springframework.stereotype.Controller;
// import org.springframework.web.bind.annotation.GetMapping;

// @Controller
// public class SidebarController {

//     // ── BROWSE ──
//     @GetMapping("/new-release")
//     public String newRelease() {
//         return "sidebar/new";
//     }

//     @GetMapping("/top-charts")
//     public String topCharts() {
//         return "sidebar/top-charts";
//     }

//     @GetMapping("/top-playlists")
//     public String topPlaylists() {
//         return "sidebar/top-playlists";
//     }

//     @GetMapping("/podcasts")
//     public String podcasts() {
//         return "sidebar/podcasts";
//     }

//     @GetMapping("/top-artists")
//     public String topArtists() {
//         return "sidebar/top-artists";
//     }

//     // ── LIBRARY ──
//     @GetMapping("/history")
//     public String history() {
//         return "sidebar/history";
//     }

//   

//     @GetMapping("/albums")
//     public String albums() {
//         return "sidebar/albums";
//     }

//     @GetMapping("/artists")
//     public String artists() {
//         return "sidebar/artists";
//     }
// }