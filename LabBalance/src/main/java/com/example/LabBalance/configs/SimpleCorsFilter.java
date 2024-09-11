//package com.example.LabBalance.configs;
//
//import jakarta.servlet.Filter;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.FilterConfig;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.ServletRequest;
//import jakarta.servlet.ServletResponse;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.core.Ordered;
//import org.springframework.core.annotation.Order;
//import org.springframework.stereotype.Component;
//
//import java.io.IOException;
//
//@Component
//@Order(Ordered.HIGHEST_PRECEDENCE)
//public class SimpleCorsFilter implements Filter {
//
//    @Override
//    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
//            throws IOException, ServletException {
//        HttpServletResponse response = (HttpServletResponse) res;
//        HttpServletRequest request = (HttpServletRequest) req;
//
//        // Get the "Origin" header from the request (this is useful if supporting multiple origins)
//        String originHeader = request.getHeader("Origin");
//
//        // Dynamically set the allowed origin or hard-code it as "http://localhost:4200" as you did
//        response.setHeader("Access-Control-Allow-Origin", originHeader != null ? originHeader : "*");
//        response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
//        response.setHeader("Access-Control-Max-Age", "3600");
//        response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Requested-With, Accept");
//        response.setHeader("Access-Control-Allow-Credentials", "true");
//
//        // Handle preflight request (OPTIONS)
//        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
//            response.setStatus(HttpServletResponse.SC_OK);
//            return; // Do not continue the filter chain for preflight requests
//        }
//
//        // Logging for debugging
//        System.out.println("CORS filter applied for request: " + request.getMethod() + " from origin: " + originHeader);
//
//        // Continue the filter chain for other request types
//        chain.doFilter(req, res);
//    }
//
//    @Override
//    public void init(FilterConfig filterConfig) throws ServletException {
//        // No initialization required
//    }
//
//    @Override
//    public void destroy() {
//        // No cleanup required
//    }
//}
