---
slug: take-control-of-your-feature-management-platform
title: Take Control of your Feature Management Platform
authors: cjoy
tags: [privacy, fedramp]
---

In recent years, feature flagging has become an increasingly popular technique used by developers to control the release of features in an application or model. However, while centralised feature flagging platforms may seem like an attractive option, there are several reasons why you shouldn't use them. In this blog post, we'll explore some of the drawbacks of centralised feature flagging platforms and explain why hosting your own feature flagging system may be a better option, especially when it comes to meeting FedRAMP compliance requirements.
What is a Centralised Feature Flagging Platform?

A centralised feature flagging platform is a feature flagging service hosted by a third-party provider, which developers can use to control the release of features in their application or model. These platforms provide a variety of features and benefits, such as scalability, reliability, and ease of use.

## Why You Shouldn't Use a Centralised Feature Flagging Platform
- **Security Risks**: When you use a centralised feature flagging platform, you're trusting a third-party provider with access to your codebase and user data. This can create security risks, as the provider may not have the same level of security protocols as your own company, and there is a greater risk of data breaches and cyber attacks.
- **Limited Customisation**: Centralised feature flagging platforms often have limitations on the level of customisation that you can achieve. This can be particularly problematic when you have specific requirements that the platform doesn't support, or when you need to integrate with other systems that aren't compatible with the platform.
- **Vendor Lock-In**: When you use a centralised feature flagging platform, you're tied to that provider, and it can be difficult to switch to a different provider if you're not satisfied with their service. This can be particularly problematic if the provider goes out of business or changes their pricing or policies in a way that doesn't align with your needs.

## FedRAMP Compliance Requirements
If you're working with sensitive data or developing software for use by the US government, you may be subject to FedRAMP compliance requirements. FedRAMP is a US government program that provides a standardized approach to security assessment, authorization, and continuous monitoring for cloud-based services.

An example of a FEDramp boundry:
![FEDramp boundry](/assets/blog/take-control-of-your-feature-management-platform/fed-ramp-boundry-example.png)


When it comes to feature flagging, FedRAMP compliance requirements dictate that you must host your own feature flagging system, rather than using a centralised platform. This is because hosting your own system allows you to have greater control over the security and customization of the system, which is essential for meeting FedRAMP compliance requirements.

## Benefits of Hosting Your Own Feature Flagging System
- **Greater Control**: Hosting your own feature flagging system allows you to have greater control over the security, customization, and integration of the system. This can be particularly important when working with sensitive data or developing software for use by the US government.
- **Better Performance**: Hosting your own feature flagging system can also improve the performance of your application or model, as you have greater control over the infrastructure and resources that are used to support the system.
- **Cost Savings**: Hosting your own feature flagging system can also be more cost-effective in the long run, as you're not paying a third-party provider for their services, and you can scale the system to meet your specific needs.

## Conclusion

While centralised feature flagging platforms may seem like an attractive option, there are several reasons why you shouldn't use them. Security risks, limited customisation, and vendor lock-in can all be problematic, and if you're subject to FedRAMP compliance requirements, hosting your own feature flagging system is essential. By hosting your own system, you can achieve greater control, better performance, and cost savings, making it a better option for many developers and organisations.

If you're looking for a self-hosted feature flagging platform, Flagbase is an excellent option to consider. Flagbase is a powerful feature flagging platform that provides all the benefits of a centralised platform, but with the added benefits of self-hosting. 