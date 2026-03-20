package com.example.demo.controller;

import org.springframework.stereotype.Controller;   // ✅ ADD THIS
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.ui.Model;
import jakarta.servlet.http.HttpSession;

@Controller   // ✅ VERY IMPORTANT
public class LoginController {

    private String generatedOtp;

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @PostMapping("/send-otp")
    public String sendOtp(@RequestParam("phone") String phone,
                          HttpSession session,
                          Model model) {

        generatedOtp = "1234";
        System.out.println("OTP: " + generatedOtp);

        session.setAttribute("phone", phone);

        return "otp";
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestParam("otp") String otp,
                            HttpSession session,
                            Model model) {

        if (otp.equals(generatedOtp)) {
            session.setAttribute("loggedIn", true);
            return "redirect:/";
        } else {
            model.addAttribute("error", "Invalid OTP");
            return "otp";
        }
    }

    @GetMapping("/")    
    public String home(HttpSession session) {

        Boolean loggedIn = (Boolean) session.getAttribute("loggedIn");

        if (loggedIn != null && loggedIn) {
            return "index";
        } else {
            return "redirect:/login";
        }
    }

    // @GetMapping("/logout")
    // public String logout(HttpSession session) {
    //     session.invalidate();
    //     return "redirect:/login";
    // }
}
