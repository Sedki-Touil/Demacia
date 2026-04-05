package com.ira.formation.controllers;

import com.ira.formation.dto.ApiResponse;
import com.ira.formation.dto.ModuleContentDTO;
import com.ira.formation.dto.ModuleDTO;
import com.ira.formation.services.ModuleService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
public class ModuleController {

    private final ModuleService moduleService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ModuleDTO creerModule(@RequestBody ModuleDTO moduleDTO) {

        return moduleService.creerModule(moduleDTO);
    }

    @GetMapping("/formation/{formationId}")
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR','APPRENANT')")
    public ApiResponse<List<ModuleDTO>> getModules(@PathVariable Long formationId,
                                                   Principal principal) {

        List<ModuleDTO> modules = moduleService.getModules(formationId, principal.getName());

        return ApiResponse.success(modules, "Modules récupérés avec succès");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ModuleDTO modifierModule(@PathVariable Long id,
                                    @RequestBody ModuleDTO moduleDTO) {

        return moduleService.modifierModule(id, moduleDTO);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void supprimerModule(@PathVariable Long id) {

        moduleService.supprimerModule(id);
    }
    
    @GetMapping("/{id}/content")
    public ModuleContentDTO getModuleContent(@PathVariable Long id) {

        return moduleService.getModuleContent(id);
    }
}