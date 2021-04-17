---
id: environment
title: Environments
sidebar_label: Environments
---

A project can have multiple environments (e.g. dev, staging, production) which correspond to different targeting states. This means if you modify a flag's targeting or a segment's rules in one environment, your changes will be scoped to that particular environment. This allows you to have different targeting rules for flags and segments in each environment.

Your organisation might be responsible for many products. These products may be made up of one or many projects (or even micro-services). One of these projects might be a web-application. You might want to [dogfood](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) features in this web-application with internal users (e.g. staff), before releasing to production users. Anything targeting rules you apply in your dogfooding environment (e.g. staging), will be contained to that particular environment and won't impact production targeting.
