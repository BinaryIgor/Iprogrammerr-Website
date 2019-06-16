package com.iprogrammerr.website.respondent;

import com.iprogrammerr.website.HtmlRespondent;
import com.iprogrammerr.website.model.Experiences;
import com.iprogrammerr.website.model.Projects;
import com.iprogrammerr.website.model.Skills;
import com.iprogrammerr.website.view.Views;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

public class WelcomeRespondent implements HtmlRespondent {

    private static final String WELCOME = "index";
    private static final String EXPERIENCES_TEMPLATE = "experiences";
    private static final String PROJECTS_TEMPLATE = "projects";
    private static final String SKILLS_TEMPLATE = "skills";
    private final Views views;
    private final Experiences experiences;
    private final Projects projects;
    private final Skills skills;

    public WelcomeRespondent(Views views, Experiences experiences, Projects projects, Skills skills) {
        this.views = views;
        this.experiences = experiences;
        this.projects = projects;
        this.skills = skills;
    }

    @Override
    public String response(HttpServletRequest request) {
        Map<String, Object> params = new HashMap<>();
        params.put(EXPERIENCES_TEMPLATE, experiences.all());
        params.put(PROJECTS_TEMPLATE, projects.all());
        params.put(SKILLS_TEMPLATE, skills.all());
        return views.rendered(WELCOME, params);
    }

    @Override
    public String path() {
        return WELCOME;
    }
}
