package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

@Controller
public class PageController {

    @Autowired
    UserRepository userRepo;

    // ✅ PLANS PAGE
    @GetMapping("/plans")
    public String plans(HttpSession session) {

        Boolean loggedIn = (Boolean) session.getAttribute("loggedIn");

        if (loggedIn != null && loggedIn) {
            return "plans";
        } else {
            return "redirect:/login";
        }
    }

    // ✅ PAYMENT PAGE
    @GetMapping("/payment")
    public String payment(@RequestParam String plan,
                          HttpSession session,
                          Model model) {

        session.setAttribute("selectedPlan", plan); // store plan
        model.addAttribute("plan", plan);

        return "payment";
    }

    // ✅ PAYMENT SUCCESS → SAVE TO DATABASE
    @PostMapping("/success")
    public String success(
            @RequestParam String email,
            @RequestParam String cardNumber,
            @RequestParam String name,
            @RequestParam String expiry,
            @RequestParam String cvv,
            @RequestParam String country,
            Model model,
            HttpSession session) {

        // ✅ get selected plan
        String plan = (String) session.getAttribute("selectedPlan");

        // ✅ save to DB
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPlan(plan);

        String last4 = cardNumber.length() >= 4
                ? cardNumber.substring(cardNumber.length() - 4)
                : cardNumber;

        user.setCard("**** **** **** " + last4);

        userRepo.save(user);

        // store user id for profile
        session.setAttribute("userId", user.getId());

        // 🔥 PLAN LOGIC
        String billing = "";
        String amount = "";
        String nextDate = "";

        if ("Pro Individual".equals(plan)) {
            billing = "2 Months";
            amount = "₹9.00";
            nextDate = "After 2 months";
        } else if ("Pro Student".equals(plan)) {
            billing = "Monthly";
            amount = "₹49.00";
            nextDate = "Next month";
        } else if ("Pro Lite".equals(plan)) {
            billing = "Weekly/Daily";
            amount = "₹29.00";
            nextDate = "Next week";
        }

        // ✅ SEND CORRECT DATA (FIXED)
        model.addAttribute("plan", plan);
        model.addAttribute("billing", billing);
        model.addAttribute("amount", amount);
        model.addAttribute("nextDate", nextDate);

        return "success";
    }

    // ✅ PLAYER PAGE
    @GetMapping("/player")
    public String player(HttpSession session) {

        Boolean loggedIn = (Boolean) session.getAttribute("loggedIn");

        if (loggedIn != null && loggedIn) {
            return "player";
        } else {
            return "redirect:/login";
        }
    }

    // ✅ PROFILE PAGE
    @GetMapping("/profile")
    public String profile(HttpSession session, Model model) {

        Boolean loggedIn = (Boolean) session.getAttribute("loggedIn");

        if (loggedIn == null || !loggedIn) {
            return "redirect:/login";
        }

        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return "redirect:/login";
        }

        User user = userRepo.findById(userId).orElse(null);

        if (user == null) {
            return "redirect:/login";
        }

        model.addAttribute("user", user);

        return "profile";
    }

    // ✅ LOGOUT
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}
