package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.ui.Model;
import jakarta.servlet.http.HttpSession;

@Controller
public class LoginController {

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @PostMapping("/send-otp")
    public String sendOtp(@RequestParam String phone,
                          HttpSession session,
                          Model model) {

        // ✅ Validate phone number
        if (phone == null || !phone.matches("\\d{10}")) {
            model.addAttribute("error", "Please enter a valid 10-digit mobile number");
            return "login";
        }

        // ✅ Generate 6-digit OTP
        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);

        // ✅ Store in session
        session.setAttribute("phone", phone);
        session.setAttribute("otp", otp);
        session.setAttribute("testOtp", otp);

        // ✅ Print OTP in console for testing
        System.out.println("==============================");
        System.out.println("OTP for " + phone + " : " + otp);
        System.out.println("==============================");

        return "redirect:/otp";
    }

    @GetMapping("/otp")
    public String otpPage(HttpSession session, Model model) {
        String phone = (String) session.getAttribute("phone");

        // ✅ Prevent direct access to /otp without phone
        if (phone == null) {
            return "redirect:/login";
        }

        model.addAttribute("phone", phone);
         // ✅ Show OTP on page for testing
    model.addAttribute("testOtp", session.getAttribute("testOtp"));
        return "otp";
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestParam String otp,
            HttpSession session,
            Model model) {

        String sessionOtp = (String) session.getAttribute("otp");
        String phone = (String) session.getAttribute("phone");

        // ✅ Handle session expiry
        if (sessionOtp == null || phone == null) {
            return "redirect:/login";
        }

        if (otp.equals(sessionOtp)) {
            session.setAttribute("loggedIn", true);
            session.removeAttribute("otp"); // ✅ Clear OTP after success
            System.out.println("✅ Login success for: " + phone);
            return "redirect:/";
        } else {
            model.addAttribute("error", "Invalid OTP. Please try again.");
            model.addAttribute("phone", phone);
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
    @GetMapping("/signup-success")
public String signupSuccess(HttpSession session) {
    session.setAttribute("loggedIn", true); // ✅ Set session
    return "index";
}

    @GetMapping("/google-login")
    public String googleLogin() {
        return "redirect:https://accounts.google.com/";
    }

    @GetMapping("/facebook-login")
    public String facebookLogin() {
        return "redirect:https://www.facebook.com/";
    }
}

