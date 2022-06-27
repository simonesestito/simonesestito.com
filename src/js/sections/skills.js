/*
 * This file is part of simonesestito.com
 * Copyright (C) 2019-2022 Simone Sestito. 
 * All rights reserved, including the right to copy, modify, and redistribute.
 */

const skillChips = document.querySelectorAll('#skills .section-content .chip[data-skill]');
const skillProjects = document.querySelectorAll('#skills .skills-project');

let currentSkill = null;
let currentChipElement = null;

// Attach event listeners
skillChips.forEach(chip => chip.addEventListener('click', pickSkill));

// A chip element of a skill has been clicked
function pickSkill(event) {
    const path = event.path || event.composedPath();
    const chipElement = path.filter(e => (e.hasAttribute && e.hasAttribute('data-skill')))[0];

    if (currentChipElement != null) {
        currentChipElement.classList.remove('active');
        currentChipElement = null;
    }

    const newSkill = chipElement.getAttribute('data-skill');
    if (currentSkill === newSkill) {
        currentSkill = null;
    } else {
        chipElement.classList.add('active');
        currentChipElement = chipElement;
        currentSkill = newSkill;
    }

    refreshSkillProjects();
}

// Show projects for the corresponding skill
function refreshSkillProjects() {
    skillProjects.forEach(project => {
        if (currentSkill !== null && project.getAttribute('data-skill').split(' ').includes(currentSkill))
            project.classList.remove('hidden');
        else
            project.classList.add('hidden');
    });
}