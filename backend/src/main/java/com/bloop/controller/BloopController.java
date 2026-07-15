package com.bloop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.bloop.dto.RunRequest;
import com.bloop.dto.RunResponse;
import com.bloop.service.BloopService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allow frontend access from anywhere (Vercel, Localhost, etc.)
public class BloopController {

    private final BloopService bloopService;

    @Autowired
    public BloopController(BloopService bloopService) {
        this.bloopService = bloopService;
    }

    @PostMapping("/run")
    public RunResponse runCode(@RequestBody RunRequest request) {
        return bloopService.executeCode(request.getCode());
    }
}
