//package com.example.LabBalance.configs;
//
//import jakarta.servlet.Filter;
//import jakarta.servlet.FilterConfig;
//import jakarta.servlet.FilterChain;
//import com.example.LabBalance.services.AccessCodeService;
//import jakarta.servlet.*;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//
//import java.io.IOException;
//@Component
//public class AccessCodeFilter implements Filter {
//
//    @Autowired
//    private AccessCodeService accessCodeService;
//
//    @Override
//    public void init(FilterConfig filterConfig) throws ServletException {
//        // Initialization code here
//    }
//
//    @Override
//    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
//            throws IOException, ServletException {
//        HttpServletRequest httpRequest = (HttpServletRequest) request;
//        HttpServletResponse httpResponse = (HttpServletResponse) response;
//
//        String requestURI = httpRequest.getRequestURI();
//
//        if (requestURI.equals("/register")) {
//            String code = httpRequest.getParameter("code");
//
//            if (accessCodeService.validateCode(code)) {
//                chain.doFilter(request, response); // Allow access
//                return;
//            } else {
//                httpResponse.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid access code");
//                return;
//            }
//        }
//
//        chain.doFilter(request, response); // Continue with the next filter in the chain
//    }
//
//    @Override
//    public void destroy() {
//        // Cleanup code here
//    }
//}
